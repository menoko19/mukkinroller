var express = require('express');
var router = express.Router();
const fs = require('fs');

let mysql = require('mysql');
let connection = mysql.createConnection({
  host : 'localhost',
  user : 'cojt_user',
  password : 'pass',
  database: 'test'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * from test_table;', (err, rows, fields) => {
    if (err) throw err;
    var content = fs.readFileSync("./public/images/goal.txt", 'utf8');
    values = content.split(",");
    date = values[0].split("-");
    var day1 = new Date();
    var finish_day = new Date(date[0]+"/"+date[1]+"/"+date[2]);
    var start_day = new Date(values[2]);
    var termDay = Math.round((finish_day - day1) / 86400000) + 2;
    var total_count = 0;
    for (let item of rows) {
      days = new Date(item.date.getFullYear() + "/" + (item.date.getMonth()+1) + "/" + item.date.getDate());
      before_termDay = Math.round((days - start_day) / 86400000) + 1;
      after_termDay = Math.round((finish_day - days) / 86400000) + 1;
      if(before_termDay > 0 && after_termDay > 0){
        total_count += Number(item.count);
      }
    }
    var goal_count = values[1] - total_count;
    var data = {
      items: {
        start_date: (start_day.getMonth()+1) + "/" + start_day.getDate(),
        finish_date: (finish_day.getMonth()+1) + "/" + finish_day.getDate(),
        remaining_time: termDay+"日",
        count: goal_count
      }
    }
    res.render("goal", data);
  });
});

router.post('/', function(req, res) {
  var date = new Date();
  text = req.body.finish_date + ',' + req.body.count + ',' + req.body.start_date;
  try {
    fs.writeFileSync("./public/images/goal.txt", text);
  }catch(e){
    console.log(e);
  }
  res.redirect('/goal');
});

module.exports = router;
