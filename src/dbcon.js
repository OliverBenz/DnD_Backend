// MySQL Setup
var mysql = require('mysql');
var pool = require("./dbcon-pool.js").pool;

// Pool var was moved to dbcon-pool.js so no data is show publically
// Pool var layout is as follows:
//
//var pool = mysql.createPool({
//  host: '[db-ip (docker-standard 172.17.0.1)]',
//  user: '[mysql-username]',
//  password: '[mysql-password]',
//  port: '[mysq-port (standard 3306]',
//  database: '[databasename]'
//});


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
