const User = require('../models/User.js');
const bcrypt = require('bcrypt');



module.exports = function(app) {

  app.get('/auth/isAdmin', (req, res) => {
    User.findOne({_id:req.session.userId}).select({isAdmin:1}).exec((error, user) => {
      if (user && user.isAdmin) {
        res.send('success');
      } else {
        res.status(500).send('No access.');
      }
    })
  })


  app.get('/auth/logout', (req, res) => {
    req.session.userId = null;
    res.send('success');
  });



  app.post('/auth/login', (req, res) => {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        return res.status(500).send('Wrong email or password.');
      } else {
        req.session.userId = user._id;
        return res.json(user).end();
      }
    });
  })



  app.post('/auth/register', (req, res) => {

    if (!req.body.username || !req.body.username.length) {
      return res.status(500).send('Email address required.');
    }

    if (!req.body.email || !req.body.email.length) {
      return res.status(500).send('Email address required.');
    }

    if (req.body.username.length >= 32) {
      return res.status(500).send('Username must be less than 32 characters.');
    }

    if (req.body.email.length >= 255) {
      return res.status(500).send('Email must be less than 255 characters.');
    }

    if (!req.body.password1 || !req.body.password1.length) {
      return res.status(500).send('Password required.');
    }

    if (!req.body.password2 || !req.body.password2.length) {
      return res.status(500).send('Password required.');
    }

    if (req.body.password1 != req.body.password2) {
      return res.status(500).send('Passwords do not match.');
    }

    User.findOne({email:req.body.email.toLowerCase().trim()}, function(error, anotherUser) {
      if (anotherUser) {
        return res.status(500).send('A user with this email already exists.');
      } else {
        User.findOne({username:req.body.username.trim()}, function(error, anotherUser) {
          if (anotherUser) {
            return res.status(500).send('A user with this username already exists.');
          } else {

            bcrypt.hash(req.body.password1, 10, function(err, hash) {
              if (err) {
                return res.status(500).send('Error hashing password.');
              }

              bcrypt.hash(req.body.password1 + 'semagrac' + new Date().getTime(), 10, function(err, token) {
                if (err) {
                  return res.status(500).send('Error hashing token.');
                }

                let data = new User({
                  username: req.body.username,
                  email: req.body.email,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  password: hash,
                  isAdmin: false,
                  token: token
                });

                if (req.body.email.toLowerCase() == process.env.ADMIN_EMAIL.toLowerCase()) {
                  data.isAdmin = true;
                }

                User.create(data, function(error, user) {
                  if (error) {
                    res.status(500).send('Error saving user.');
                  } else {
                    req.session.userId = user._id;
                    res.json(user).end();
                  }
                })
              })

            })
          }
        })
      }
    });

  })
}
