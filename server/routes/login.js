var router = require('express').Router();
var passport = require('passport');
var pg = require('pg');
var encryptLib = require('../../modules/encryptLib');

var connectionString = require('../../modules/initializeDB').connectionString;

router.post('/', passport.authenticate('local', {
  successRedirect: '/login/success',
  failureRedirect: '/login/failure'
}));

router.get('/success', function(req, res){
  res.send('OK');
});

router.get('/failure', function(req, res){
  res.send('FAIL');
});

module.exports = router;
