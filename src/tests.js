var connection = require("./src/dbcon.js").connection;

// Testing function
exports.checkUserCharacter = function(req, res, next){
  // Check if user/char exist and are connected
  connection.query("SELECT id FROM characters WHERE charString='" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId='" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);
    };

    if(result.length === 0){
      res.status(401);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({"message": "Wrong CharacterId / SessionId"}));
    }
    else{
      next();
    }
  });
}