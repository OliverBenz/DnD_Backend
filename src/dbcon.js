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
        callback({"success": false, "message": ""});
      }
      callback({"success": true, "data": result});
    });
  });
}



// var dbconfig = {
//   host: '172.17.0.1',
//   user: 'dnd',
//   password: 'B71x!#rOWv$WH3&!2ltu43Y*nW3@7J',
//   port: '3306',
//   database: 'dnd'
// };
// var connection;

// exports.handleDisconnect = function() {
//   connection = mysql.createConnection(dbconfig);

//   connection.connect(function(err) {
//     if(err) {
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000);
//     }
//     else{
//       return connection;
//     }
//   });

//   connection.on('error', function(err) {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') {
//       handleDisconnect();
//     } else {
//       throw err;
//     }
//   });
// }

// handleDisconnect();

// exports.connection = connection;