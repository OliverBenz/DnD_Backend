var connection = require("./dbcon.js").connection;

var checkStrings = [
  "'",
  '"',
  "SELECT",
  "UNION",
  ";",
  "SLEEP()",
  "TABLE_SCHEMA",
  "TABLE_NAME"
];
var error = false;

exports.sanitize = function(req, res, next){
  for(var key in req.params) {
    for(let i = 0; i < checkStrings.length; i++){
      if(req.params[key].toUpperCase().includes(checkStrings[i].toUpperCase())){
        error = true;
        res.status(400);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "Data sanitizing error" }));
      }
    }
  }

  if(req.params.sessionId && req.params.charString) checkUserCharacter(req, res, next);
  if(!error) next();
}

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

