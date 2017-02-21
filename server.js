var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');
var compression = require('compression')

// Create our app
var app = express();

app.use(function (req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});


app.use(compression())

// serve static assets normally
app.use(express.static(path.join(__dirname, 'public')))

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});


const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log("server started on port " + PORT);
