var express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;



passport.use(new LocalStrategy(
  function(username, password, done) {

}));



var app = express();

app.configure(function() {
   app.set('view engine', 'ejs');
   app.use(express.session({ secret: 'keyboard cat'}));
   app.use(passport.initialize());
   app.use(passport.session());

});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.session.messages });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});



app.listen(4000);
//at this point I has to do an npm install ejs
