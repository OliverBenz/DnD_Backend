var db = require("../dbcon.js");

// Get Money
exports.getMoney = function(req, res){
  const { charString, sessionId } = req.params;
  db.query(`SELECT copper, silver, electrum, gold, platinum from characters WHERE charString = '${charString}'`, (result) => {
    if(result.success){
      res.status(200);
      result.data = result.data[0];
    }
    else{
      res.status(500);
      result.message = "Could not get Character Money";
    }
    res.send(JSON.stringify(result));
  });
}

// Update Money
exports.patchMoney = function(req, res){
  const { copper, silver, electrum, gold, platinum } = req.body;

  let sql = "UPDATE characters SET id=id"

  sql += copper !== undefined ? `, copper = ${copper}` : "";
  sql += silver !== undefined ? `, silver = ${silver}` : "";
  sql += electrum !== undefined ? `, electrum = ${electrum}` : "";
  sql += gold !== undefined ? `, gold = ${gold}` : "";
  sql += platinum !== undefined ? `, platinum = ${platinum}` : "";

  // if(req.body.copper !== undefined) sql += ", copper = " + req.body.copper;
  // if(req.body.silver !== undefined) sql += ", silver = " + req.body.silver;
  // if(req.body.electrum !== undefined) sql += ", electrum = " + req.body.electrum;
  // if(req.body.gold !== undefined) sql += ", gold = " + req.body.gold;
  // if(req.body.platinum !== undefined) sql += ", platinum = "  + req.body.platinum;

  sql += ` WHERE charString = '${req.params.charString}'`;

  db.query(sql, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not update character money";
    }
    res.send(JSON.stringify(result));
  });
}