var db = require("../dbcon.js");

// Get Spells
exports.getCharSpells = function(req, res){
  db.query(`SELECT s.id, s.name, s.level, s.range FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '${req.params.charString}')`, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not get character Spells";
    }
    res.send(JSON.stringify(result));
  });
}

// Get Spells with Limit and filter
exports.getCharSpellsLimit = function(req, res){
  const { filter, limit, offset, charString, sessionId } = req.params;

  let sql = `SELECT s.id, s.name, s.level, s.range FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '${charString}') `;
  sql += filter ? `AND s.name LIKE '%${filter}%' ` : "";
  sql += `ORDER BY s.name ASC LIMIT ${limit} OFFSET ${offset}`;

  // let sql = `SELECT s.id, s.name, s.level, s.range FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '${req.params.charString}' AND ch.userId = (SELECT id FROM users WHERE sessionId = '${req.params.sessionId}')) ORDER BY s.name ASC LIMIT ${req.params.limit} OFFSET ${req.params.offset}`;
  // if(req.params.filter) sql = `SELECT s.id, s.name, s.level, s.range FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '${req.params.charString}' AND ch.userId = (SELECT id FROM users WHERE sessionId = '${req.params.sessionId}')) AND s.name LIKE '%${req.params.filter}%' ORDER BY s.name ASC LIMIT ${req.params.limit} OFFSET ${req.params.offset}`

  db.query(sql, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not get character Spells";
    }
    res.send(JSON.stringify(result));    
  });
}

// Add new Spell to Char
exports.postCharSpell = function(req, res){
  db.query(`INSERT INTO charSpells VALUES ((SELECT id FROM characters WHERE charString = '${req.params.charString}'), ${req.body.spellId})`, (result) => {
    if(result.success) {
      res.status(200);
      result.data = true;
    }
    else{
      res.status(500);
      result.message = "Could not add spell to character";
    }
    res.send(JSON.stringify(result));
  });
}

// Delete Spell from Char
exports.delCharSpell = function(req, res){
  db.query(`DELETE FROM charSpells WHERE characterId = (SELECT id FROM characters WHERE charString = '${req.params.charString}') AND spellId = ${req.body.spellId}`, (result) => {
    if(result.success) {
      res.status(200);
      result.data = false;
    }
    else{
      res.status(500);
      result.message = "Could not remove spell from character";
    }
    res.send(JSON.stringify(result));
  });
}

// Check if Char has Spell
exports.checkCharSpell = function(req, res){
  const { charString, spellId } = req.params;

  db.query(`SELECT * FROM charSpells WHERE characterId = (SELECT id FROM characters WHERE charString = '${charString}') AND spellId = ${spellId}`, (result) => {
    if(result.success){
      res.status(200);

      result.data = result.data.length === 1 ? true : false;
    }
    else{
      res.status(500);
      result.message = "Could not check for spell";
    }
    res.send(JSON.stringify(result));
  });
}