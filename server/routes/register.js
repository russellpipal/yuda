var router = require('express').Router();
var passport = require('passport');
var path = require('path');
var pg = require('pg');
var encryptLib = require('../../modules/encryptLib');

var connectionString = 'postgres://localhost:5432/yuda';

router.post('/', function(req, res){
  pg.connect(connectionString, function(err, client){
    console.log(req.body);
    var today = new Date();
    console.log('user', req.body.username);
    console.log('password', req.body.password);
    var query = client.query('INSERT INTO public.user (username, password, first_visit, last_visit) VALUES ($1, $2, $3, $4) RETURNING username, password',
    [req.body.username, encryptLib.encryptPassword(req.body.password), today, today]);

    query.on('error', function(err){
      console.log(err);
      res.sendStatus(500);
    });

    query.on('end', function(){
      res.sendStatus(200);
      client.end();
    });
  });
});

module.exports = router;
