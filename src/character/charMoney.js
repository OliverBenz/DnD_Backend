var connection = require("../dbcon.js").connection;

// Get Money
exports.getCharMoney = function(req, res){
  connection.query("SELECT copper, silver, electrum, gold, platinum from characters WHERE charString = '" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Character Money" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result[0]}));
  });
}

// Update Money
exports.patchCharMoney = function(req, res){
  let sql = "UPDATE characters SET id=id"

  if(req.body.copper !== undefined) sql += ", copper = " + req.body.copper;
  if(req.body.silver !== undefined) sql += ", silver = " + req.body.silver;
  if(req.body.electrum !== undefined) sql += ", electrum = " + req.body.electrum;
  if(req.body.gold !== undefined) sql += ", gold = " + req.body.gold;
  if(req.body.platinum !== undefined) sql += ", platinum = "  + req.body.platinum;

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