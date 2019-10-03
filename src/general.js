var db = require("./dbcon.js");

// Get Alignments
exports.getAlignments = function(req, res){
  db.query("SELECT id, name FROM alignments", (result) => {
    if(result["success"]){
      res.status(200);
    }
    else{
      res.status(500);
      result["message"] = "Could not get alignments";
    }
    res.send(JSON.stringify(result));
  });
}


// Get Backgrounds
exports.getBackgrounds = function(req, res){
  db.query("SELECT id, name FROM backgrounds", (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not get Backgrounds";
    }

    res.send(JSON.stringify(result));
  });
}


// Get Spells
exports.getSpells = function(req, res){
  db.query("SELECT s.id, s.name, s.level, s.range from spells s ORDER BY name ASC", (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not get Spells";
    }

    res.send(JSON.stringify(result));
  });
}

// Get Spells with Limit
exports.getSpellsLimit = function(req, res){
  let sql = "SELECT s.id, s.name, s.level, s.range from spells s ORDER BY name ASC LIMIT " + req.params.limit + " OFFSET " + req.params.offset;
  if(req.params.filter) sql = "SELECT s.id, s.name, s.level, s.range from spells s WHERE s.name LIKE '%" + req.params.filter + "%' ORDER BY name ASC LIMIT " + req.params.limit + " OFFSET " + req.params.offset;

  db.query(sql, (result) => {
    if(result["success"]) res.status(200)
    else{
      res.status(500);
      result["message"] = "Coult not get Spells";
    }

    res.send(JSON.stringify(result));
  });
}


// Get Spell Specific
exports.getSpellSpec = function(req, res){
  let sql = "SELECT s.*, sc.name as schoolName FROM spells s INNER JOIN schools sc ON s.school = sc.id WHERE s.id = " + req.params.id;

  db.query(sql, (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not get Spell Information";
    }

    res.send(JSON.stringify(result))
  });
}