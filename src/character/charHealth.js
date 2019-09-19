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
  connection.query("UPDATE characters SET maxHealth = " + req.body.maxHealth + ", currentHealth = " + req.body.currentHealth + ", tempHealth = " + req.body.tempHealth + " WHERE charString = '" + req.params.charString + "'", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "message": "Update successful" }));
  });
}