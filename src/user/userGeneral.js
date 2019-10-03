var db = require("../dbcon.js");
var bcrypt = require('bcryptjs');

exports.login = function(req, res){
  db.query("SELECT password FROM users WHERE email='" + req.body.email + "'", (result) => {
    if(result["success"]){
      if(result["data"].length === 0){
        res.status(401);
        res.send(JSON.stringify({ "success": false, "message": "Invalid E-Mail" }));
      }
      else{
        if(bcrypt.compareSync(req.body.password, result["data"][0]["password"])){
          db.query("SELECT sessionId FROM users WHERE email='" + req.body.email + "'", (result) => {
            res.status(200);
            result["data"] = result["data"][0];
            res.send(JSON.stringify(result));
          });
        }
        else{
          res.status(401);
          res.send(JSON.stringify({ "success": false, "message": "Invalid password"}));
        }        
      }
    }
    else{
      res.status(500);
    }
    res.send(JSON.stringify())
  });
}

exports.register = function(req, res){
  let sessionId = bcrypt.hashSync(req.body.firstname + req.body.email, 12).split("/").join("");

  db.query("INSERT INTO users VALUES (0, '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.email + "', '" + bcrypt.hashSync(req.body.password, 12) + "', '" + sessionId + "')", (result) => {
    if(result["success"]) {
      res.status(200);
      result["data"] = sessionId;
    }
    else{
      res.status(409);
      result["message"] = "User already registered";
    }
    res.send(JSON.stringify(result));
  });
}