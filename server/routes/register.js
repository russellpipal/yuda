var router = require('express').Router();
var passport = require('passport');
var pg = require('pg');
var encryptLib = require('../../modules/encryptLib');

var connectionString = require('../../modules/initializeDB').connectionString;

router.post('/', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    var today = new Date();
    var query = client.query('INSERT INTO users (username, password, first_visit, last_visit) VALUES ($1, $2, $3, $4) RETURNING username, password',
    [req.body.username, encryptLib.encryptPassword(req.body.password), today, today]);

    query.on('error', function(err){
      console.log(err);
      res.sendStatus(500);
    });

    query.on('end', function(){
      done();
      res.sendStatus(200);
    });
  });
});

module.exports = router;
