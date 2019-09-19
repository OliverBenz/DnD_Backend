var connection = require("../dbcon.js").connection;
var bcrypt = require('bcryptjs');

exports.login = function(req, res){
  connection.query("SELECT password FROM users WHERE email='" + req.body.email + "'", (err, result) => {
    if(err){
      console.log(err);
    };

    if(result.length === 0){
      res.status(401);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Invalid E-Mail"}));
    }
    else{
      if(bcrypt.compareSync(req.body.password, result[0]["password"])){
        connection.query("SELECT sessionId FROM users WHERE email='" + req.body.email + "'", (err, result) => {
          res.status(200);
          res.set('Content-Type', 'application/json');
          res.send(JSON.stringify({ "success": true, "data": result[0] }));
        });
      }
      else{
        res.status(401);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "Invalid password"}));
      }
    }
  });
}

exports.register = function(req, res){
  let sessionId = bcrypt.hashSync(req.body.firstname + req.body.email, 12).split("/").join("");

  connection.query("INSERT INTO users VALUES (0, '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.email + "', '" + bcrypt.hashSync(req.body.password, 12) + "', '" + sessionId + "')", (err, result) => {
    if(err){
      console.log(err.errno);
      // Duplicate entry
      if(err.errno == 1062){
        res.status(409);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "User already registered"}));
      }
    } 

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": sessionId }));
  });
}