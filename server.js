var express = require("express");
var path = require("path");
var nodemailer = require("nodemailer");
var compression = require("compression");
var fs = require("fs");
var bodyParser = require("body-parser");

var smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "payment@fka.sg", // Your email id
    pass: "Firstkick123<" // Your password
  }
};

var smtpTransport = nodemailer.createTransport(smtpConfig);

// Create our app
var app = express();
const PORT = process.env.PORT || 3000;
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.get("*", function(req, res) {
  // and drop 'public' in the middle of here
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/send", function(req, res) {
  var mailOptions = {
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.html
  };
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      return console.log(error);
    } else {
      res.sendStatus(200);
    }
    console.log("Message sent: " + response.message);
    smtpTransport.close();
  });
});

app.listen(PORT, "0.0.0.0", function() {
  console.log("Listening on Port 3000");
});
