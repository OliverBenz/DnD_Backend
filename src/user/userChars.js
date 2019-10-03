var db = require("../dbcon.js");
var bcrypt = require('bcryptjs');

exports.getCharList = function(req, res){
  db.query("SELECT firstname, lastname, level, charString from characters WHERE userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (result) => {
    if(result["success"]) res.status(200);
    else res.status(500);
    
    res.send(JSON.stringify(result));
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

  db.query(sql, (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Error";
    }
    res.send(JSON.stringify(result));
  });
}

exports.delChar = function(req, res){
  // Check password
    db.query("SELECT password FROM users WHERE sessionId='" + req.params.sessionId + "'", (password) => {
      if(password["success"]){
        if(password["data"].length === 0){
          res.status(401);
          res.send(JSON.stringify({ "success": false, "message": "Invalid sessionId" }));
        }
        else{
          // If password correct
          if(bcrypt.compareSync(req.body.password, password["data"][0]["password"])){
            db.query('DELETE FROM characters WHERE charString = "' + req.body.charString + '" AND userId = (SELECT id FROM users WHERE sessionId = "' + req.params.sessionId + '")', (result) => {
              if(result["success"]) res.status(200);
              else{
                res.status(500);
                result["message"] = "Could not delete character";
              }
              res.send(JSON.stringify(result));
            });        
          }
          else{
            res.status(401);
            res.send(JSON.stringify({ "success": false, "message": "Invalid password" }));
          }
        }
      }
  });
}