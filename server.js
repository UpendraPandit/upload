
const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');


const app = express();
var files = 'https://miro.medium.com/max/1400/1*5U1_u5xB3CGakEdmzL2LSA.png';
// Set S3 endpoint to DigitalOcean Spaces
//Check the endpoint
const spacesEndpoint = new aws.Endpoint('sfo3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId:'DO00PYHPT46GW8BEM92G',
  secretAccessKey:'Oyv5S8wYuheetiWQJHNTQgF2o5tONjI+cRRND1/HdM0'


});

// Change bucket property to your Space name
const upload = multer({
  storage: multerS3({
    s3: s3,
    //check the bucket name
    bucket: 'image-db',
    acl: 'public-read',
  
    key: function (request, files, cb) {

      cb(null, files.originalname);
    }
  })
}).single("image");

// Views in public directory
app.use(express.static('public'));

app.post('/uploads',upload,(req, res) => {
  res.send('uploaded');
})
// Main, error and success views
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get("/success", function (request, response) {
  response.sendFile(__dirname + '/public/success.html');
});

app.get("/error", function (request, response) {
  response.sendFile(__dirname + '/public/error.html');
});
// app.post('/:checkforme',(req,res)=>{
//   const {filename} = req.params;


// });
app.post('/upload', function (request, response, next) {
  upload(request, response, function (error) {
    if (error) {
      console.log(error);
      return response.redirect("/error");
    }
    console.log('File uploaded successfully.');
    response.redirect("/success");
  });
});

app.listen(3001, function () {
  console.log('Server listening on port 3001.');
});                                                                                               
