const express = require("express");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
global.SENT_EMAILS = [];
var PORT = process.env.PORT || 3128;

var app = express();
var router = express.Router();

router.get('/ping', function (req, res) {
  res.json({
    message: 'Its Alive!'
  });
});

router.post('/send-mail', async (req, res, next) => {
  try {
    let {
      toEmail,
      subEmail,
      bodyEmail
    } = req.body;

    if (!bodyEmail) {
      return res.status(400).send({
        "error": {
          "message": " Email and Email Body is requied!"
        }
      });
    }

    if(!toEmail) {
      toEmail = 'jai.kumar@splashlearn.com'
    }

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'jai.kumar@splashlearn.com',
        pass: ''
      }
    });

    let mailOptions = {
      from: 'jai.kumar@splashlearn.com',
      to: toEmail,
      subject: subEmail,
      html: bodyEmail
    };

    if(isEmailSentAlready(bodyEmail)) {
      return res.status(200).send({
        "status": true,
        "message": "Email Sent Already for this PT."
      });
    }
    else {
      transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
          throw new error('Something went wrong')
        }
        return res.status(200).send({
          "status": true,
          "message": "Email Send Successfully."
        });
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).send({
      "error": {
        "message": "Something went wrong"
      }
    });
  }
});

function isEmailSentAlready(emailBody) {
  console.log('return==>',global.SENT_EMAILS.indexOf(emailBody) >= 0 ? true : false);
  if(global.SENT_EMAILS.indexOf(emailBody) >= 0) {
    return true;
  }
  global.SENT_EMAILS.push(emailBody)
  return false;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

app.listen(PORT, () => console.log(`Mailing server is up on port# : ${PORT}!`))