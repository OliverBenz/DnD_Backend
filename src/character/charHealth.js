var connection = require("../dbcon.js").connection;
var db = require("../dbcon.js");

// Get Health
exports.getHealth = function(req, res){
  const { charString } = req.params;

  let sql = `SELECT maxHealth, currentHealth, tempHealth from characters WHERE charString = '${charString}'`;
  
  db.query(sql, (result) => {
    if(result.success){
      res.status(200);
      result.data = result.data[0];
    }
    else{
      res.status(500);
      result.message = "Could not get Character Health";
    }

    res.send(JSON.stringify(result));
  });
}

// Update Health
exports.patchHealth = function(req, res){
  const { maxHealth, currentHealth, tempHealth } = req.body;

  let sql = "UPDATE characters SET id=id";

  sql += maxHealth !== undefined ? `, maxHealth = ${maxHealth}` : "";
  sql += currentHealth !== undefined ? `, currentHealth = ${currentHealth}` : "";
  sql += tempHealth !== undefined ? `, tempHealth = ${tempHealth}` : "";

  // if(req.body.maxHealth !== undefined) sql += `, maxHealth = ${req.body.maxHealth}`;
  // if(req.body.currentHealth !== undefined) sql += `, currentHealth = ${req.body.currentHealth}`;
  // if(req.body.tempHealth !== undefined) sql += `, tempHealth = ${req.body.tempHealth}`;

  sql += ` WHERE charString = '${req.params.charString}'`;

  db.query(sql, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not update character health";
    }

    res.send(JSON.stringify(result));
  });
}