/**
 * NPM Module dependencies.
 */
const express = require('express');
const trackRoute = express.Router();
const bodyparser = require('body-parser')
const multer = require('multer');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

/**
 * NodeJS Module dependencies.
 */
const { Readable } = require('stream');
const { response } = require('express');


/**
 * Create Express server && Express Router configuration.
 */
const app = express();
app.use(bodyparser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: true }))


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });


/**
 * Connect Mongo Driver to MongoDB.
 */
let db;
MongoClient.connect('mongodb://localhost:27017',{ useUnifiedTopology: true } ,(err, client) => {
  if (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  }
    db = client.db('uploadDB')
});

/**
 * GET /tracks/:trackID
 */

 app.get('/', (req,res) => {
     console.log("hello world")
     res.json("hello world");
 })

 app.get("/audio/list", (req, res)=>{
    console.log("audio list")
      
    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: 'tracks'
    });
    
    bucket.find({}).toArray((err,files) =>{
      if(err){
        return res.status(500).json({
          success: false,
          message: 'No available'
        });      
      }
      
      return res.status(200).json({
          success: true,
          file: files
      });
  })

})


app.get('/audio/:trackID', (req, res) => {
    try {
      var trackID = new ObjectID(req.params.trackID);
    } catch(err) {
      return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');
  
    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: 'tracks'
    });
  
    let downloadStream = bucket.openDownloadStream(trackID);
  
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });
  
    downloadStream.on('error', () => {
      res.sendStatus(404);
    });
  
    downloadStream.on('end', () => {
      res.end();
    });
  });

  /**
 * POST /tracks
 */
const storage = multer.memoryStorage()
const upload = multer({ storage: storage});
//app.use(upload.any());



app.post('/audio/upload',(req, res) => {
      
      upload.single('mp3')(req, res, (err) => {
      console.log(req.body);
      //console.log(req.file)
      if (err) {
        return res.status(400).json({ message: "Upload Request Validation Failed" });
      }else if(req.body.songName === ""){
        return res.status(400).json({ message: "Name of the song is required" });
      } 
      //console.log(req.body)
      let trackName = req.body.songName;
       
      // Covert buffer to Readable Stream
      const readableTrackStream = new Readable();
      readableTrackStream.push(req.file.buffer);
      readableTrackStream.push(null);
  
      let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'tracks'
      });
      const metadata = { 
          size: req.file.size || "not found size",
          originalname: req.file.originalname || "Not found originalname",
          mimetype: req.file.mimetype || "Not found mimetype",
          encoding: req.file.encoding || "not found encoding",
          duration: req.body.duration || "0",
          album: req.body.songAlbum || "",
          artist: req.body.songArtist || "",
          name: req.body.songName || ""
      }
      let uploadStream = bucket.openUploadStream(trackName, {metadata});
      let id = uploadStream.id;
      readableTrackStream.pipe(uploadStream);
  
      uploadStream.on('error', () => {
        return res.status(500).json({ message: "Error uploading file" });
      });
  
      uploadStream.on('finish', () => {
        return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
      });
    });
  });

  app.get('/audio/download/:trackID', (req, res) => {

    try {
        var trackID = new ObjectID(req.params.trackID);
      } catch(err) {
        return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
      }
      res.set('content-type', 'audio/mp3');
      res.set('accept-ranges', 'bytes');
      
      res.set("Content-Disposition", `attachment; filename=${trackID}.mp3`)
    
      let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'tracks'
      });
      /*
      bucket.find({_id:trackID}).toArray((err,files) =>{
        if(!files[0] || files.length === 0){
            return res.status(500).json({
                success: false,
                message: 'No available'
            });      
        }
        res.set('Content-Length', files[0].chunkSize)
        res.status(200).json({
            success: true,
            file: files[0]
        });
    })*/

    let downloadStream = bucket.openDownloadStream(trackID);
    console.log(downloadStream);
    downloadStream.pipe(res);

})




  app.listen(3005, () => {
    console.log("App listening on port 3005!");
  });