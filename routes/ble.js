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
    res.render("ble");
});

router.post('/', function(req, res) {
    connection.query("insert into test_table(distance, count, score, kcal) values("+req.body.distance+","+req.body.count+","+req.body.score+","+req.body.kcal+");", (err, res) => {
        if (err) throw err;
    });
    res.redirect('/');
});
module.exports = router;
