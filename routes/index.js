var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'REST API' });
});
router.get('/*', function (req, res) {
  res.send('<h4 style="color:red;text-align:center;position:relative;top:30%">Contact to API controller sbycc.com</h4>');
});
module.exports = router;
