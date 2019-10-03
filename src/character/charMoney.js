var db = require("../dbcon.js");

// Get Money
exports.getCharMoney = function(req, res){
  db.query("SELECT copper, silver, electrum, gold, platinum from characters WHERE charString = '" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (result) => {
    if(result["success"]){
      res.status(200);
      result["data"] = result["data"][0];
    }
    else{
      res.status(500);
      result["message"] = "Could not get Character Money";
    }
    res.send(JSON.stringify(result));
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

  db.query(sql, (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not update character money";
    }
    res.send(JSON.stringify(result));
  });
}