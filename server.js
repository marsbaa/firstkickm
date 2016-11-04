var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');


// Create our app
var app = express();

const PORT = process.env.PORT || 3000;


app.use(function (req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});


// serve static assets normally
app.use(express.static(__dirname + '/public'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).


var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.GMAIL_U, // Your email id
      pass: process.env.GMAIL_P // Your password
    }
};
var smtpTransport = nodemailer.createTransport(smtpConfig);

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).


app.get('/send',function(req,res){
    var mailOptions={
        to : req.query.to,
        subject : req.query.subject,
        text : req.query.text,
        html : req.query.html
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});
});

app.listen(PORT);
console.log("server started on port " + PORT);
