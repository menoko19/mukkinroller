var express = require('express');
var router = express.Router();

let mysql = require('mysql');
let connection = mysql.createConnection({
  host : 'localhost',
  user : 'cojt_user',
  password : 'pass',
  database: 'test'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * from test_table;', (err, rows, fields) => {
    if (err) throw err;
    var data = {
      items: rows
    };
    res.render("index", data);
  });
});

module.exports = router;
