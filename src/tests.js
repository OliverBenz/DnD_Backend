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
  "limit"
];

exports.checkData = function(req, res, next){
  if(sanitize(req)){
    if(req.params.sessionId && req.params.charString){
      if(checkUserCharacter(req)) {
        next();
      }
      else{
        send(res, 500, false, "SessionId does not match charString", []);
      }
    }
    else{
      next();
    }
  }
  else{
    send(res, 500, false, "Data sanitizing error", []);
  }
}

// Testing function
sanitize = function(req){
  // Check Parameters
  for(let key in req.params) {
    for(let i = 0; i < checkStrings.length; i++){
      if(req.params[key].toUpperCase().includes(checkStrings[i].toUpperCase())){
        return false;
      }
    }
  
    // Check if INT values contain chars
    for(let i = 0; i < intValues.length; i++){
      if(key === intValues[i]){
        // console.log(!(req.params[key] == parseInt(req.params[key])));
        if (!(req.params[key] == parseInt(req.params[key]))) return false;
      }
    }
  }

  // Check Body
  for(let key in req.body){
    for(let i = 0; i < checkStrings.length; i++){
      if(req.body[key].toUpperCase().includes(checkStrings[i].toUpperCase())){
        return false;
      }
    }

    // Check if INT values contain chars
    for(let i = 0; i < intValues.length; i++){
      if(key === intValues[i]){
        // console.log(!(req.params[key] == parseInt(req.params[key])));
        if (!(req.body[key] == parseInt(req.body[key]))) return false;
      }
    }
  }

  return true;
}

checkUserCharacter = function(req){
  connection.query("SELECT id FROM characters WHERE charString='" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId='" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);
      return false;
    };

    console.log(result.length);
    console.log(result);
    console.log("sessionid" + req.params.sessionId);
    console.log("charString" + req.params.charString);

    if(result.length === 0){
      return false;
    }
    else{
      return true;
    }
  });
}


send = function(res, code, success, message, data){
  res.status(code);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ "success": success, "message": message, "data": data }));
}