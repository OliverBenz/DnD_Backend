var connection = require("../dbcon.js").connection;

// Get General Character Information
exports.getCharGeneral = function(req, res){
  connection.query("SELECT c.firstname, c.lastname, c.level, c.xp, a.name, c.background, c.age, c.height, weight FROM characters c INNER JOIN alignments a ON a.id = c.alignment WHERE c.charString='" + req.params.charString + "' AND c.userId = (SELECT id from users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Character Information" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result[0]}));
  });
}

// Update General Character Information
exports.patchCharGeneral = function(req, res){
  connection.query("UPDATE characters SET xp", (err, result) => {
    if(err){
      console.log(err);
    }

    // TODO: IMPLEMENT patch character XP and level(if XP at certain value)
  });
}