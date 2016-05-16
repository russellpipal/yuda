var router = require('express').Router();
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/yuda';

router.get('/', function(req, res){
  var results = [];
  pg.connect(connectionString, function(err, client){
    var query = client.query('SELECT username, goal_name, goal_desc, starting_date, ending_date, completed_date, user_goal.id, user_goal.viewed FROM goal JOIN user_goal ON goal.id = user_goal.goal_id JOIN users ON goal.user_id = users.id WHERE user_goal.user_id = ' + req.user.id + ' ORDER BY ending_date');

    query.on('error', function(err){
      console.log(err);
      res.sendStatus(500);
    });

    query.on('row', function(rowData){
      results.push(rowData);
    });

    query.on('end', function(){
      res.send(results);
      client.end();
    });
  });
});

router.put('/markViewed', function(req, res){
  pg.connect(connectionString, function(err, client){
    var query = client.query('UPDATE user_goal SET viewed = true where id = $1', [req.body.id]);

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
