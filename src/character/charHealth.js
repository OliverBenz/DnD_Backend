var connection = require("../dbcon.js").connection;
var db = require("../dbcon.js");

// Get Health
exports.getCharHealth = function(req, res){
  let sql = `SELECT maxHealth, currentHealth, tempHealth from characters WHERE charString = '${req.params.charString}' AND userId = (SELECT id FROM users WHERE sessionId = '${req.params.sessionId}')`;
  
  db.query(sql, (result) => {
    if(result["success"]){
      res.status(200);
      result["data"] = result["data"][0];
    }
    else{
      res.status(500);
      result["message"] = "Could not get Character Health";
    }

    res.send(JSON.stringify(result));
  });
}

// Update Health
exports.patchCharHealth = function(req, res){
  let sql = "UPDATE characters SET id=id";

  sql += req.body.maxHealth !== undefined ? `, maxHealth = ${req.body.maxHealth}` : "";
  sql += req.body.currentHealth !== undefined ? `, currentHealth = ${req.body.currentHealth}` : "";
  sql += req.body.tempHealth !== undefined ? `, tempHealth = ${req.body.tempHealth}` : "";

  // if(req.body.maxHealth !== undefined) sql += `, maxHealth = ${req.body.maxHealth}`;
  // if(req.body.currentHealth !== undefined) sql += `, currentHealth = ${req.body.currentHealth}`;
  // if(req.body.tempHealth !== undefined) sql += `, tempHealth = ${req.body.tempHealth}`;

  sql += ` WHERE charString = '${req.params.charString}'`;

  db.query(sql, (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not update character health";
    }

    res.send(JSON.stringify(result));
  });
}