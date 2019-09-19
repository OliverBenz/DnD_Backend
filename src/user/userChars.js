var connection = require("../dbcon.js").connection;
var bcrypt = require('bcryptjs');

exports.getCharList = function(req, res){
  connection.query("SELECT firstname, lastname, level, charString from characters WHERE userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);
    };

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
}

exports.postChar = function(req, res){
  let charString = bcrypt.hashSync(String(Math.random()) , 12).substring(5, 20);

  var sql = "INSERT INTO characters VALUES (0, '" + charString + "', ";
  
  sql += "(SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "'), ";
  
  sql += "'" + req.body.firstname + "', '" + req.body.lastname + "', " + req.body.level + ", " + req.body.xp + ", ";
  sql += req.body.alignment + ", '" + req.body.background + "', " + req.body.age + ", " + req.body.height + ", " + req.body.weight + ", ";
  sql += req.body.maxHealth + ", " + req.body.tempHealth + ", " + req.body.currentHealth + ", ";
  sql += req.body.copper + ", " + req.body.silver + ", " + req.body.electrum + ", " + req.body.gold + ", " + req.body.platinum + ")";

  connection.query(sql, (err, result) => {
    if(err){
      if(err.errno === 1062){
        // res.status()
      }
      else{
        console.log(err);

        res.status(409);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "Char already registered"}));
      }
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": { "charString": charString }}));
  });
}

exports.delChar = function(req, res){
  // Check password
    connection.query("SELECT password FROM users WHERE sessionId='" + req.params.sessionId + "'", (err, result) => {
    if(err){
      console.log(err);
    };

    if(result.length === 0){
      res.status(401);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Invalid SessionId"}));
    }
    else{
      // If password correct
      if(bcrypt.compareSync(req.body.password, result[0]["password"])){
        connection.query('DELETE FROM characters WHERE charString = "' + req.body.charString + '" AND userId = (SELECT id FROM users WHERE sessionId = "' + req.params.sessionId + '")', (err, result) => {
          if(err){
            console.log(err);
            res.status(500);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({ "success": false, "message": "Could not delete Character" }));
          }

          res.status(200);
          res.set('Content-Type', 'application/json');
          res.send(JSON.stringify({ "success": true, "message": "Deletion successful" }));
        });        
      }
      else{
        res.status(401);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "Invalid password" }));
      }
    }
  });
}