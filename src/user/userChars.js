var db = require("../dbcon.js");
var bcrypt = require('bcryptjs');
var atob = require("atob");

function getSessionId(token){
  return atob(token.split(" ")[1]).split(":")[1];
}

exports.getCharList = function(req, res){
  const sessionId = getSessionId(req.headers.authorization);

  // Also check if char has been deleted
  db.query(`SELECT firstname, lastname, level, charString from characters WHERE userId = (SELECT id FROM users WHERE sessionId = '${sessionId}') AND deleted = 0`, (result) => {
    if(result.success) res.status(200);
    else res.status(500);
    
    res.send(JSON.stringify(result));
  });
}

exports.postChar = function(req, res){
  const sessionId = getSessionId(req.headers.authorization);
  const { firstname, lastname, level, xp, alignment, background, age, height, weight, maxHealth, tempHealth, currentHealth, copper, silver, electrum, gold, platinum } = req.body;
  let charString = bcrypt.hashSync(String(Math.random()) , 12).substring(5, 20);

  let sql = `INSERT INTO characters VALUES (0, '${charString}', (SELECT id FROM users WHERE sessionId = '${sessionId}'), '${firstname}', '${lastname}', ${level}, ${xp}, 
  ${alignment}, '${background}', ${age}, ${height}, ${weight}, 
  ${maxHealth}, ${tempHealth}, ${currentHealth}, 
  ${copper}, ${silver}, ${electrum}, ${gold}, ${platinum})`;


  // var sql = "INSERT INTO characters VALUES (0, '" + charString + "', ";
  
  // sql += "(SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "'), ";
  
  // sql += "'" + firstname + "', '" + lastname + "', " + level + ", " + xp + ", ";
  // sql += alignment + ", '" + background + "', " + age + ", " + height + ", " + weight + ", ";
  // sql += maxHealth + ", " + tempHealth + ", " + currentHealth + ", ";
  // sql += copper + ", " + silver + ", " + electrum + ", " + gold + ", " + platinum + ")";

  db.query(sql, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Error";
    }
    res.send(JSON.stringify(result));
  });
}

exports.delChar = function(req, res){
  // TODO: Delete all char references before deleting the character

  const sessionId = getSessionId(req.headers.authorization);
  // Check password
    db.query(`SELECT password FROM users WHERE sessionId = '${sessionId}'`, (password) => {
      if(password.success){
        if(password.data.length === 0){
          res.status(401);
          res.send(JSON.stringify({ success: false, message: "Invalid sessionId" }));
        }
        else{
          // If password correct
          if(bcrypt.compareSync(req.body.password, password.data[0]["password"])){
            db.query(`UPDATE characters SET deleted = 1 WHERE charString = '${charString}'`, (result) => {
              if(result["success"]) res.status(200);
              else{
                res.status(500);
                result.message = "Could not delete character";
              }
              res.send(JSON.stringify(result));
            });        
          }
          else{
            res.status(401);
            res.send(JSON.stringify({ success: false, message: "Invalid password" }));
          }
        }
      }
  });
}