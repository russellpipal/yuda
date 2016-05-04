var router = require('express').Router();
var passport = require('passport');
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/yuda';

router.get('/', function(req, res){
  var results = [];
  pg.connect(connectionString, function(err, client, done){
    var query = client.query('SELECT * FROM public.goal WHERE user_id = $1', [req.user.id]);

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

module.exports = router;
