var db = require("../dbcon.js");

// Get all Notes
exports.getCharNotes = function(req, res){
  db.query(`SELECT id, date, note FROM notes WHERE charId = (SELECT id FROM characters WHERE charString = '${req.params.charString}') ORDER BY date DESC`, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not get notes";
    }
    res.send(JSON.stringify(result));
  });
}

// Post new Note
exports.postCharNotes = function(req, res){
  const { date, note } = req.body;

  db.query(`INSERT INTO notes VALUES (0, (SELECT id FROM characters WHERE charString = '${req.params.charString}'), '${date}', '${note}')`, (result) => {

    if(result.success) {
      res.status(200);
      result.data = {
        id: result.data.insertId,
        date: date.split(" ")[0],
        note: note
      };
    }
    else{
      res.status(500);
      result.message = "Could not add note";
    }
    res.send(JSON.stringify(result));
  });
}

// Update existing Note
exports.patchCharNotes = function(req, res){
  const { id, note } = req.body;

  db.query(`UPDATE notes SET note='${note}' WHERE id = ${id} AND charId = (SELECT id FROM characters WHERE charString = '${req.params.charString}')`, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not update note";
    }
    res.send(JSON.stringify(result));
  });
}

// Delete Note
exports.delCharNotes = function(req, res){
  const { id, charString } = req.params;

  db.query(`DELETE FROM notes WHERE id = ${id} AND charId = (SELECT id FROM characters WHERE charString = '${charString}')`, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not delete Note";
    }
    res.send(JSON.stringify(result));
  });
}