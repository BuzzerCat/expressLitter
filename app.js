var express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var app = express();

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.session.messages });
});

app.listen(4000);
