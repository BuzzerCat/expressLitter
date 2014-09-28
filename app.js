var express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}


function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}



passport.use(new LocalStrategy(
  function(username, password, done) {
   console.log(  "local strategy used.");
     process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });


}));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

var app = express();

app.configure(function() {
   app.set('view engine', 'ejs');
   app.use(express.session({ secret: 'keyboard cat'}));
   app.use(express.bodyParser());

   app.use(passport.initialize());
   app.use(passport.session());

});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.session.messages });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
       console.log("1:"+err);
       return next(err); }
    if (!user) {
      console.log("2:"+ info.message + user)
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { 
      console.log("3:"+err);
      return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});



app.listen(4000);
//at this point I has to do an npm install ejs
