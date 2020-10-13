const express = require('express');

const app = express();
const multer = require('multer')

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient
const binary = mongodb.Binary
const ObjectId = require('mongodb').ObjectID;
const fs = require('fs')


//add other middleware

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })
/*
app.post('/upload', upload.single('sample'), (req, res) => {
    console.log(req.file)
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
 // Define a JSONobject for the image attributes for saving to database
  
 var finalImg = {
      contentType: req.file.mimetype,
      image:  new Buffer(encode_image, 'base64')
   };


    mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
        if (err) {
            return err
        }
        else {
            let db = client.db('uploadDB')
            let collection = db.collection('files')
            try {
                collection.insertOne(finalImg, (err, result) => {
                    console.log(result)
                 
                    if (err) return console.log(err)
                 
                    console.log('saved to database')
                    res.send({msg: "saved correctly"})
                   
                     
                  })
            }
            catch (err) {
                console.log('Error while inserting:', err)
            }
            client.close()
            
        }

    })
})  
*/
// upoad single file

app.post('/upload', multer().single('sample'), (req, res) => {
    console.log("upload avatar")
    try {
        if(!req.file) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            //let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            //avatar.mv('./uploads/' + avatar.name);
            const image = req.file;
            console.log(req.file, req.body)
            const newFileName= image.originalname + '-' + Date.now()
            let file = { name: newFileName, file: binary(image.buffer), contentType: image.mimetype }
            insertFile(file, res).then(()=>{
                //send response
                        res.send({
                            status: true,
                            message: 'File is uploaded',
                            data: {
                                name: newFileName,
                                mimetype: image.mimetype,
                                size: image.size
                            }
                        });
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

async function insertFile(file, res) {
    return await mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
        if (err) {
            return err
        }
        else {
            let db = client.db('uploadDB')
            let collection = db.collection('files')
            try {
                collection.insertOne(file)
                console.log('File Inserted')
                
            }
            catch (err) {
                console.log('Error while inserting:', err)
            }
            client.close()
            
        }

    })
}

app.get('/photo/:id', (req, res) => {
    var filename = req.params.id;

    mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
        if (err) {
            return err
        }
        else {
            let db = client.db('uploadDB')
            let collection = db.collection('files')
            
            collection.findOne({'_id': ObjectId(filename) }, (err, result) => {
     
                if (err) return console.log(err)
                console.log(result)
               //res.contentType('image/jpeg');
               if(result.contentType === "audio/mpeg"){
                    //file is mp3 - create stream
                    console.log("is mp3")
                        // Peform a find to get a cursor
                    let stream = collection.find().stream();
                    stream.on("data", function(item) {

                      });
                  
                      // When the stream is done
                      stream.on("end", function() {
                        
                        db.close();
                      });

               }else{
                   //file is an image
                    res.contentType(result.contentType);
                    res.send(result.file.buffer)
                    
               }
               
               
                
              })
            
        }

    })
     
    
})

// upload multiple files
/*
app.post('/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];
                
                //move photo to upload directory
                photo.mv('./uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
*/
//make uploads directory static
//app.use(express.static('uploads'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);