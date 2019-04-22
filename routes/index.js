var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({name: 'index', status: 'Working!'});
});

module.exports = router;
