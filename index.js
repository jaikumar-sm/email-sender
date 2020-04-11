const express = require("express");
const nodemailer = require('nodemailer'); 

var PORT = process.env.PORT || 3128;

var app = express();
var router = express.Router();

router.get('/ping', function(req, res) {
  res.json({ message: 'Its Alive!' });   
});

router.post('/send-mail', function(req, res) {
  // console.log('req %s',req.query);
  var toEmail = req.query.toEmail;
  var subEmail = req.query.subEmail;
  var bodyEmail = req.query.bodyEmail;

  let mailTransporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: 'jai.kumar@splashlearn.com', 
        pass: 'lexttvvpxkkefaau'
    } 
  });
  
  let mailDetails = { 
    from: 'jai.kumar@splashlearn.com', 
    to: toEmail, 
    subject: subEmail, 
    text: bodyEmail
  }; 
  
  mailTransporter.sendMail(mailDetails, function(err, data) { 
    if(err) { 
      console.log('Error Occurs');
      res.send(err);
    } else { 
      console.log('Email sent successfully'); 
      res.send(data);
    } 
  }); 
});

app.use('/api', router);

app.listen(PORT, () => console.log(`Mailing server is up on port# : ${PORT}!`))