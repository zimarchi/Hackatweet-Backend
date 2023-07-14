var express = require('express');
var router = express.Router();


const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* POST users signup. */
router.post('/signup', (req, res) => {
  // Check if the user has filled all the inputs
  if (!checkBody(req.body, ['firstname','username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        password: hash,
        token: uid2(32),
        image: '/images/default_profile_400x400.png',
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, username:newDoc.username, firstname: newDoc.firstname });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

/* POST users signup. */
router.post('/signin', (req, res) => {
  // Check if the user has filled all the inputs
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});



module.exports = router;
