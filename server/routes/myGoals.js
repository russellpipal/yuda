var router = require('express').Router();
var passport = require('passport');
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/yuda';

router.get('/', function(req, res){
  var results = [];
  pg.connect(connectionString, function(err, client, done){
    var query = client.query('SELECT * FROM goal WHERE user_id = $1 ORDER BY ending_date', [req.user.id]);

    query.on('error', function(err){
      console.log(err);
      done();
      res.sendStatus(500);
    });

    query.on('row', function(rowData){
      results.push(rowData);
    });

    query.on('end', function(){
      done();
      res.send(results);
    });
  });
});

router.put('/completeGoal', function(req, res){
  pg.connect(connectionString, function(err, client, done){
    var today = new Date();
    var query = client.query('UPDATE goal SET completed_date = $1 WHERE id = $2', [today, req.body.id]);

    query.on('error', function(err){
      console.log(err);
      done();
      res.sendStatus(500);
    });

    query.on('end', function(){
      res.sendStatus(200);
      done();
    });
  });
});

module.exports = router;
