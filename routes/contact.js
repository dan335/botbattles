const mailer = require('../lib/mailer');


module.exports = function(app) {

  app.post('/api/contact', (req, res) => {
    if (!req.body.email || !req.body.email.length) {
      return res.status(500).send('Email address required.');
    }

    if (!req.body.message || !req.body.message.length) {
      return res.status(500).send('Message is empty.');
    }

    const to = process.env.ADMIN_EMAIL;
    const subject = 'New Message from BotBattles.io';

    mailer({email:req.body.email, name:req.body.email, text:req.body.message, to:to, subject:subject}).then(() => {
      res.send('success');
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Error sending email.');
    })
  })

}
