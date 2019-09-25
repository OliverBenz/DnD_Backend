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

var intValues = [
  "id",
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
      connection.query("SELECT id FROM characters WHERE charString='" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId='" + req.params.sessionId + "')", (err, result) => {
        if(err){
          console.log(err);
          send(res, 500, false, "Could not check character", []);
        }

        if(result.length === 0){
          send(res, 500, false, "sessionId and charString not connected", []);
        }
        else{
          next();
        }
      });
    }
    else{
      next();
    }
  }
  else{
    send(res, 500, false, "Data sanitizing error", []);
  }
}

sanitize = function(req, data){
  for(let key in data){
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
  return true;
}

send = function(res, code, success, message, data){
  res.status(code);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ "success": success, "message": message, "data": data }));
}