var router = require('express').Router();
var passport = require('passport');
var path = require('path');

router.post('/', function(req, res){
  req.logout();
  res.send('OK');
});

module.exports = router;
