var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");

router.post('register', function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: 'Please pass username and password.' });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      address: req.body.address
    });
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Username already exists.' });
      }
      res.json({ success: true, msg: 'Successful created new user.' });
    });
  }
});

router.post('/signin', function (req, res) {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800 // 1 week
          });
          // return the information including token as JSON
          res.json({ success: true, token: 'JWT ' + token });
        } else {
          res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
});

router.get('/signout', passport.authenticate('jwt', { session: false }), function (req, res) {
  req.logout();
  res.json({ success: true, msg: 'Sign out successfully.' });
});

router.post('/book', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    console.log(req.body);
    var newBook = new Book({
      code: req.body.code,
      className: req.body.className,
      subject: req.body.subject,
      unitName: req.body.unitName,
      subSubject: req.body.subSubject,
      api_controller: req.body.api_controller

    });

    newBook.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Save book failed.' });
      }
      res.json({ success: true, msg: 'Successful created new book.' });
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

// get json book data
router.get('/secure-book-api-json', function (req, res) {
  Book.find(function (err, books) {
    if (err) return next(err);
    res.json(books);
  });

})

router.get('/*', function (req, res) {
  res.send('<h4 style="color:red;text-align:center;position:relative;top:30%">Contact to API controller sbycc.com<br>Mail To: <a href="mailto:anilyadav@sbytechnocratesindia.com">anilyadav@sbytechnocratesindia.com</h4>');
});

router.get('/book', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Book.find(function (err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


module.exports = router;
