var db = require("../dbcon.js");

// Get General Character Information
exports.getGeneral = function(req, res){
  const { charString, sessionId } = req.params;

  let sql = `SELECT c.firstname, c.lastname, c.level, c.xp, a.name, c.background, c.age, c.height, weight FROM characters c INNER JOIN alignments a ON a.id = c.alignment WHERE c.charString='${charString}'`;
  
  db.query(sql, (result) => {
    if(result.success){
      res.status(200);
      result.data = result.data[0];
    }
    else{
      res.status(500);
      result.message = "Coult not get Character Information";
    }

    res.send(JSON.stringify(result));
  });
}

// Update General Character Information
exports.patchGeneral = function(req, res){
  db.query(`UPDATE characters SET xp`, (result) => {
    if(err){
      console.log(err);
    }

    // TODO: IMPLEMENT patch character XP and level(if XP at certain value)
  });
}