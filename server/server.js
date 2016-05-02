var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryptLib');

var index = require('./routes/index');
var register = require('./routes/register');
var connectionString = 'postgres://localhost:5432/yuda';

var app = express();

app.use(bodyParser.json());
app.use(express.static('server/public'));

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
    console.log('Called localStrategy');
    pg.connect(connectionString, function(err, client){
      console.log('Called local --pg');
      var user = null;
      var query = client.query('SELECT * FROM user WHERE username = $1', [username]);

      query.on('row', function(row){
        console.log('User object', row);
        console.log('Password', password);
        user = row;
        if(encryptLib.comparePassword(password, user.password)){
          console.log('Passwords match in local strategy');
          done(null, user);
        } else {
          done(null, false, { message: 'Incorrect username or password' });
        }
      });

      query.on('end', function(){
        // checks to see if user was found
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
  console.log('Serializer called');
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log('Deserializer called');
  pg.connect(connectionString, function(err, client){
    var user = {};
    console.log('Connected to PG in deserializer');
    var query = client.query('SELECT * FROM user WHERE id = $1', [id]);

    query.on('row', function(row){
      console.log('User row found:', row);
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

var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port, 'Press ctrl+C to exit');
});
