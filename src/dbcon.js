// MySQL Setup
var mysql = require('mysql');
// var dbconfig = {
//  host: 'localhost',
//  user: 'dnd',
//  password: 'B71x!#rOWv$WH3&!2ltu43Y*nW3@7J',
//  port: '3306',
//  database: 'dnd'
// };

var pool = mysql.createPool({
  host: '172.17.0.1',
  user: 'dnd',
  password: 'B71x!#rOWv$WH3&!2ltu43Y*nW3@7J',
  port: '3306',
  database: 'dnd'
});

exports.query = function(sql, callback){
  pool.getConnection((err, connection) => {
    if(err){
      console.log(err);
    }

    connection.query(sql, (err, result) => {
      connection.release();

      if(err){
        console.log(err);
        callback({success: false, message: ""});
      }
      else{
        callback({success: true, data: result});
      }
    });
  });
}