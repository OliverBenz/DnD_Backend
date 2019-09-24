var connection = require("../dbcon.js").connection;

// Get Spells
exports.getCharSpells = function(req, res){
  connection.query("SELECT s.id, s.name, s.level, s.range FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '" + req.params.charString + "' AND ch.userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "'))", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Character Spells" }));
    };

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
}

// Get Spells with Limit
exports.getCharSpellsLimit = function(req, res){
  let sql = "SELECT s.id, s.name, s.level, s.range FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '" + req.params.charString + "' AND ch.userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')) ORDER BY s.name ASC LIMIT " + req.params.limit + " OFFSET " + req.params.offset;
  if(req.params.filter) sql = "SELECT s.id, s.name, s.level, s.range FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '" + req.params.charString + "' AND ch.userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')) WHERE s.name LIKE '%" + req.params.filter + "%' ORDER BY s.name ASC LIMIT " + req.params.limit + " OFFSET " + req.params.offset

  connection.query(sql, (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Character Spells" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));    
  });
}

// Add new Spell to Char
exports.postCharSpell = function(req, res){
  connection.query("INSERT INTO charSpells VALUES ((SELECT id FROM characters WHERE charString = '" + req.params.charString + "'), " + req.body.spellId + ")", (err, result) => {
    if(err) {
      console.log(err)

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not add spell to character" }));
    };

    res.status(200);
    res.set('Content-Type', 'application/json');
    // Data is the userHasSpell Attribute in Frontend -> True means user has spell
    res.send(JSON.stringify({ "success": true, "message": "Successfully Added Spell", "data": true }));
  });
}

// Delete Spell from Char
exports.delCharSpell = function(req, res){
  connection.query("DELETE FROM charSpells WHERE characterId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "') AND spellId = " + req.body.spellId, (err, result) => {
    if(err) {
      console.log(err)
      
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not remove spell from character" }));
    };

    res.status(200);
    res.set('Content-Type', 'application/json');
    // Data is the userHasSpell Attribute in Frontend -> False means user doesn't have spell
    res.send(JSON.stringify({ "success": true, "message": "Successfully Removed Spell", "data": false }));
  });
}

// Check if Char has Spell
exports.checkCharSpell = function(req, res){
  connection.query("SELECT * FROM charSpells WHERE characterId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "') AND spellId = " + req.params.spellId, (err, result) => {
    if(err){
      console.log(err); 

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not check for spell" }));
    }
    
    if(result.length === 1){
      res.status(200);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": true, "data": true }));
    }
    else{
      res.status(200);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": true, "data": false }));
    }
  });
}