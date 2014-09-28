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

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
});


app.listen(4000);
//at this point I has to do an npm install ejs
