const connection = require('../app/dbconn'),
      dotenv = require('dotenv').config(),
      express = require('express'),
      bodyParser = require('body-parser'),
      uuidv4 = require('uuid/v4'),
      sgMail = require('@sendgrid/mail'),
      app = express();

const router = express.Router();


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.get('/', isAuthenticated, (req, res) => {
  connection.query('SELECT * from accounts', (err, accounts) => {
    if (!err) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(accounts));
    } else {
      throw err;
    }
  })
});

router.post('/', (req, res) => {
  let account = req.body;
  let uuid = uuidv4();
  account.uuid = uuid;
  account.isActivated = 0;
  connection.query('INSERT INTO accounts SET ?', account, (err, result) => {
    if (!err) {
      console.log(account);
    } else {
      throw err;
    }
  });
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: `${account.email}`,
    from: `info@agendamanager.nl`,
    subject: `Registration at agendamanager.nl`,
    text: `Someone has invited you to join Agenda Manager. Visit agendamanager.nl/verify and paste the following code: ${account.uuid}`,
    html: `Someone has invited you to join Agenda Manager. Visit <a href="https://www.agendamanager.nl/verify?uuid=${account.uuid}">agendamanager.nl/verify</a> and paste the following code: <br><strong>${account.uuid}</strong>`,
  }
  // Disable actually sending an email, for now
  sgMail.send(msg);
  console.log(msg);
});

function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  // IF A USER ISN'T LOGGED IN, TGIVE BACK 403
  res.status(403).end();
}

module.exports = router;
