var express = require('express');
const bodyParser = require("body-parser");
var User = require("../models/user");
var router = express.Router();
var passport = require("passport");
const cors = require('./cors');

var authenticate = require("../authenticate");

/* GET users listing. */
router.get('/', cors.corsWithOptions, function (req, res, next) {
  res.send(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, function (err, users) {
    User.find({}, function(err, users){
      if(err){
        var err = new Error("Somethings has gone wrong!");
        err.status = 403;
        next(err);
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }
    })
  } );
}); 

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({
      username: req.body.username
    }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          err: err
        });
      } else {
        if(req.body.firstname)
          user.firstname = req.body.firstname;
        if(req.body.lastname)  
          user.lastname = req.body.lastname;
        user.save(function(err, user){
          if(err){
             res.statusCode = 500;
             res.setHeader('Content-Type', 'application/json');
             res.json({
               err: err
             });
             return;
          }
        })    
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            status: 'Registration Successful!'
          });
        });
      }
    });
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({
    _id: req.user._id
  });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token: token,
    status: 'You are successfully logged in!'
  });
});



router.get('/logout', cors.corsWithOptions, function (req, res, next) {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
