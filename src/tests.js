var db = require("./dbcon.js");

var cautionStrings = [
  "'",
  '"',
  "SELECT",
  "UNION",
  ";",
  "SLEEP()",
  "TABLE_SCHEMA",
  "TABLE_NAME"
];

var intValues = [
  "id",
  "spellId",
  "offset",
  "limit",
  "copper",
  "silver",,
  "electrum",
  "gold",
  "platinum",
  "tempHealth",
  "currentHealth",
  "maxHealth"
];

exports.checkData = function(req, res, next){
  // If params and body values are OK
  if(sanitize(req.params) && sanitize(req.body)){
    // If character/user check necessary and OK
    if(req.params.sessionId && req.params.charString){
      let sql = "SELECT id FROM characters WHERE charString='" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId='" + req.params.sessionId + "')";
      db.query(sql, (result) => {
        if(result["success"]){
          if(result["data"].length === 0){
            res.status(500);
            result["message"] = "sessionId and charString not connected";
            res.send(JSON.stringify(result));
          }
          else{
            next();
          }
        }
        else{
          res.status(500);
          result["message"] = "Could not check character";
          res.send(JSON.stringify(result));
        }
      });
    }
    else{
      next();
    }
  }
  else{
    res.status(500);
    res.send(JSON.stringify({ "success": false, "message": "Data sanitizing error" }));
  }
}

sanitize = function(data){
  for(let key in data){
    if(data[key] != undefined){
      // If String -> Check for cautionStrings
      if(! intValues.includes(key)){
        for(let i = 0; i < cautionStrings.length; i++){
          if(data[key].toUpperCase().includes(cautionStrings[i].toUpperCase())){
            return false;
          }
        }
      }
      // If INT -> Check if really INT
      else{
        // If value is not equals to INT of value -> value includes char
        if(!(data[key] == parseInt(data[key]))) return false;
      }
    }
  }
  return true;
}
