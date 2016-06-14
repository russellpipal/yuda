var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var pg = require('pg');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryptLib');
var initializeDB = require('../modules/initializeDB').initializeDB;

var index = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');
var newGoal = require('./routes/newGoal');
var myGoals = require('./routes/myGoals');
var friends = require('./routes/friends');
var logout = require('./routes/logout');
var connectionString = require('../modules/initializeDB').connectionString;

var app = express();

app.use(bodyParser.json());
app.use(express.static('server/public'));

initializeDB();

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 600000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new localStrategy({ passReqToCallback: true, usernameField: 'username' },
  function(req, username, password, done){
    pg.connect(connectionString, function(err, client){
      var user = null;
      var query = client.query('SELECT * FROM users WHERE username = $1', [username]);

      query.on('row', function(row){
        user = row;
        if(encryptLib.comparePassword(password, user.password)){
          done(null, user);
        } else {
          done(null, false, { message: 'Incorrect username or password' });
        }
      });

      query.on('end', function(){
        if (user === null){
          done(null, false, { message: 'Incorrect username or password' });
        }
        client.end();
      });

      if(err){
        console.log(err);
      }
    });
  }
));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  pg.connect(connectionString, function(err, client){
    var user = {};
    var query = client.query('SELECT * FROM users WHERE id = $1', [id]);

    query.on('row', function(row){
      user = row;
      done(null, user);
    });

    query.on('end', function(){
      client.end();
    });

    if(err){
      console.log('Error in pg deserializer', err);
    }
  });
});

app.use('/', index);
app.use('/register', register);
app.use('/addGoal', newGoal);
app.use('/login', login);
app.use('/myGoals', myGoals);
app.use('/friends', friends);
app.use('/logout', logout);

var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port, 'Press ctrl+C to exit');
});
