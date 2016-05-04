var router = require('express').Router();
var passport = require('passport');
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/yuda';

router.post('/', function(req, res){
  pg.connect(connectionString, function(err, client){

    var query = client.query('INSERT INTO goal (goal_name, goal_desc, starting_date, ending_date, user_id) ' +
      'VALUES ($1, $2, $3, $4, $5)', [req.body.goal_name, req.body.goal_desc, req.body.starting_date, req.body.ending_date, req.user.id]);

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

router.get('/users', function(req, res){
  var userList = [];
  pg.connect(connectionString, function(err, client){
    var query = client.query('SELECT id, username FROM public.user');

    query.on('error', function(err){
      console.log(err);
      res.sendStatus(500);
    });

    query.on('row', function(rowData){
      userList.push(rowData);
    });

    query.on('end', function(){
      res.send(userList);
      client.end();
    });

  });
});

module.exports = router;
