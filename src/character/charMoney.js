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
  connection.query("UPDATE characters SET copper = " + req.body.copper + ", silver = " + req.body.silver + ", electrum = " + req.body.electrum + ", gold = " + req.body.gold + ", platinum = " + req.body.platinum + " WHERE charString = '" + req.params.charString + "'", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "message": "Update successful" }));
  });
}