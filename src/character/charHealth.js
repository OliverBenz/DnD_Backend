var connection = require("../dbcon.js").connection;

// Get Health
exports.getCharHealth = function(req, res){
  connection.query("SELECT maxHealth, currentHealth, tempHealth from characters WHERE charString = '" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Character Health" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result[0]}));
  });
}

// Update Health
exports.patchCharHealth = function(req, res){
  let sql = "UPDATE characters SET id=id";

  if(req.body.maxHealth !== undefined) sql += ", maxHealth = " + req.body.maxHealth;
  if(req.body.currentHealth !== undefined) sql += ", currentHealth = " + req.body.currentHealth;
  if(req.body.tempHealth !== undefined) sql += ", tempHealth = " + req.body.tempHealth;

  sql += " WHERE charString = '" + req.params.charString + "'";

  connection.query(sql, (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "message": "Update successful" }));
  });
}