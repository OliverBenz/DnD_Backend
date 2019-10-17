var db = require("./dbcon.js");
var bcrypt = require('bcryptjs');
var atob = require("atob");

var cautionStrings = [
  "'",
  '"',
  "SELECT",
  "UNION",
  ";",
  "SLEEP()",
  "TABLE_SCHEMA",
  "TABLE_NAME",
  "*"
];
// test
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
  "maxHealth",
  "level",
  "xp",
  "background",
  "alignment",
  "age",
  "height",
  "weight",
  "trackValue",
  "trackMax",
  "trackMin"
];


// Called Functions
exports.checkSanitize = function(req, res, next){
  if(sanitize(req.params) && sanitize(req.body)){
    next();
  }
  else{
    res.status(500);
    res.send(JSON.stringify({ success: false, message: "Data sanitizing error" }));
  }
}

exports.checkData = async function(req, res, next){
  if(sanitize(req.params) && sanitize(req.body)){
    if(await checkSessionId(req.headers.authorization)){
      if(req.params.charString === undefined || await checkUserChar(req.headers.authorization, req.params.charString)){
        next();
      }
      else{
        res.status(401);
        res.send(JSON.stringify({ success: false, message: "Invalid character String for User" }));
      }
    }
    else{
      res.status(401);
      res.send(JSON.stringify({ success: false, message: "Unauthorized Access" }));
      // Auth error 401
    }
  }
  else{
    res.status(500);
    res.send(JSON.stringify({ success: false, message: "Data sanitizing error" }));
  }
}


// Testing Functions
checkSessionId = function(token){
  const email = atob(token.split(" ")[1]).split(":")[0];
  const sessionId = atob(token.split(" ")[1]).split(":")[1];

  let sql = `SELECT id FROM users WHERE email = '${email}' AND sessionId = '${sessionId}'`;
  
  return new Promise(resolve => {
    db.query(sql, (result) => {
      if(result.success){
        if(result.data.length === 1){
          resolve(true);
        }
        else{
          resolve(false);
        }
      }
      else{
        resolve(false);
      }
    });  
  });
}

checkUserChar = function(token, charString){
  const sessionId = atob(token.split(" ")[1]).split(":")[1];

  // Also check if char has been deleted
  let sql = `SELECT id FROM characters WHERE charString = '${charString}' AND userId = (SELECT id FROM users WHERE sessionId = '${sessionId}') AND deleted = 0`;
  
  return new Promise(resolve => {
    db.query(sql, (result) => {
      if(result.success){
        if(result.data.length === 1){
          resolve(true);
        }
        else{
          resolve(false);
        }
      }
      else{
        resolve(false);
      }
    });
  });
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
        if(data[key] !== undefined && data[key] !== null){
          // If value is not equals to INT of value -> value includes char
          if(!(data[key] == parseInt(data[key]))) return false;
        }
      }
    }
  }
  return true;
}