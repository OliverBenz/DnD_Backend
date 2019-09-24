var connection = require("./dbcon.js").connection;

// Get Alignments
exports.getAlignments = function(req, res){
  connection.query("SELECT id, name FROM alignments", (err, result) =>{
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get alignments" }));      
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
}


// Get Backgrounds
exports.getBackgrounds = function(req, res){
  connection.query("SELECT id, name FROM backgrounds", (err, result) => {
    if(err){
      console.log(err);
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Backgrounds" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
}


// Get Spells
exports.getSpells = function(req, res){
  connection.query("SELECT s.id, s.name, s.level, s.range from spells s ORDER BY name ASC", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({"success": false, "message": "Could not get Spells" }))
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
}

// Get Spells with Limit
exports.getSpellsLimit = function(req, res){
  let sql = "SELECT s.id, s.name, s.level, s.range from spells s ORDER BY name ASC LIMIT " + req.params.limit + " OFFSET " + req.params.offset;
  if(req.params.filter) sql = "SELECT s.id, s.name, s.level, s.range from spells s WHERE s.name LIKE '%" + req.params.filter + "%' ORDER BY name ASC LIMIT " + req.params.limit + " OFFSET " + req.params.offset;

  connection.query(sql, (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({"success": false, "message": "Could not get Spells" }))
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
}


// Get Spell Specific
exports.getSpellSpec = function(req, res){
  connection.query("SELECT * FROM spells WHERE id = " + req.params.id, (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Spell Information" }));
    }
    else{
      res.status(200);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": true, "data": result }));
    }
  });
}