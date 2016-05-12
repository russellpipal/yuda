var router = require('express').Router();
var passport = require('passport');
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/yuda';

router.post('/', function(req, res){
  var returnRow = {}
  pg.connect(connectionString, function(err, client){

    var query = client.query('INSERT INTO goal (goal_name, goal_desc, starting_date, ending_date, user_id) ' +
      'VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.body.goal_name, req.body.goal_desc, req.body.starting_date, req.body.ending_date, req.user.id]);

    query.on('error', function(err){
      console.log(err);
      res.sendStatus(500);
    });

    query.on('end', function(){
      res.send(returnRow);
      client.end();
    });

    query.on('row', function(rowData){
      returnRow = rowData;
    });
  });
});

router.post('/friends', function(req, res){
  var queryString = 'INSERT INTO user_goal (goal_id, user_id) VALUES ';
  var friends = req.body.friends;
  var goal_id = req.body.goal_id;

  for(var i=0; i<friends.length; i++){
    queryString += '(' + goal_id + ', ' + friends[i].id + '), ';
  }
  queryString = queryString.substring(0, queryString.length - 2);

  pg.connect(connectionString, function(err, client){
    var query = client.query(queryString);

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
    var query = client.query('SELECT id, username FROM users');

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
