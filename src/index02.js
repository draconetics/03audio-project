const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs')

app.get('/',function(req,res){	
    let element = 'This is the main page';
    res.send(element);
  });
  
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });









  app.get('/stream', (req, res) => {
    const file = __dirname + '/mp3/celta-vigo.mp3';
    const stat = fs.statSync(file);
    const total = stat.size;
    if (req.headers.range) {

    }
    fs.exists(file, (exists) => {
        if (exists) {
            const range = req.headers.range;
            console.log(range);
            const parts = range.replace(/bytes=/, '').split('-');
            const partialStart = parts[0];
            const partialEnd = parts[1];

            const start = parseInt(partialStart, 10);
            const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
            const chunksize = (end - start) + 1;
            const rstream = fs.createReadStream(file, {start: start, end: end});

            res.writeHead(206, {
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg'
            });
            rstream.pipe(res);

        } else {
            res.send('Error - 404');
            res.end();
            // res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
            // fs.createReadStream(path).pipe(res);
        }
    });
});

app.get('/mp3', (req, res) => {
    return httpListener(req,res);
});



function httpListener (request, response) {
  // We will only accept 'GET' method. Otherwise will return 405 'Method Not Allowed'.
  if (request.method != 'GET') { 
      sendResponse(response, 405, {'Allow' : 'GET'}, null);
      return null;
  }

  //var filename = initFolder + url.parse(request.url, true, true).pathname.split('/').join(path.sep);
  var filename = __dirname + '/mp3/celta-vigo.mp3';

  var responseHeaders = {};
  var stat = fs.statSync(filename);

  // Check if file exists. If not, will return the 404 'Not Found'. 
  if (!fs.existsSync(filename)) {
      sendResponse(response, 404, null, null);
      return null;
  }
  //responseHeaders['Content-Type'] = getMimeNameFromExt(path.extname(filename));
  responseHeaders['Content-Type'] = 'audio/mpeg';
  responseHeaders['Content-Length'] = stat.size; // File size.
      
  sendResponse(response, 200, responseHeaders, fs.createReadStream(filename));
}

function sendResponse(response, responseStatus, responseHeaders, readable) {
  response.writeHead(responseStatus, responseHeaders);

  if (readable == null)
      response.end();
  else
      readable.on('open', function () {
          readable.pipe(response);
      });

  return null;
}

app.get('/download', (req, res) => {
    const file = __dirname + '/mp3/celta-vigo.mp3';
    res.download(file);
});











//routes
//const userRouter = require('./user/user.route')
//app.use('/', userRouter);

const portConfig = require('./config/port.config');
//database
const db = require('./database/db.js');
db.connect()
  .then(() => {
    console.log('database connected..')
    app.listen(portConfig.PORT, () => {
      console.log('Listening on port: ' + portConfig.PORT);
    });
  });