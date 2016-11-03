var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');


// Create our app
var app = express();
var router = express.Router();


app.use(function (req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// serve static assets normally
app.use(express.static('public'));
//app.use(express.static(__dirname + '/public'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).


var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'contact@fka.sg', // Your email id
      pass: 'firstkick1234' // Your password
    }
};
var smtpTransport = nodemailer.createTransport(smtpConfig);

app.use('/send', router);
// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, res){
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

router.get('/',function(req,res){
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


app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function () {
  console.log('App is running at port', app.get('port'));
});
