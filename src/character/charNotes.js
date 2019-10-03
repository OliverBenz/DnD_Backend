var db = require("../dbcon.js");

// Get all Notes
exports.getCharNotes = function(req, res){
  db.query("SELECT id, date, note FROM notes WHERE charId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "') ORDER BY date DESC", (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not get notes";
    }
    res.send(JSON.stringify(result));
  });
}

// Post new Note
exports.postCharNotes = function(req, res){
  db.query("INSERT INTO notes VALUES (0, (SELECT id FROM characters WHERE charString = '" + req.params.charString + "'), '" + req.body.date + "', '" + req.body.note + "')", (result) => {
    let data = {};
    if(result["success"]) {
      res.status(200);
      data = {
        "id": result.data.insertId,
        "date": req.body.date.split(" ")[0],
        "note": req.body.note
      }
    }
    else{
      res.status(500);
      result["message"] = "Could not add note";
    }
    res.send(JSON.stringify(result));
  });
}

// Update existing Note
exports.patchCharNotes = function(req, res){
  db.query("UPDATE notes SET note='" + req.body.note + "' WHERE id = " + req.body.id + " AND charId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "')", (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not update note";
    }
    res.send(JSON.stringify(result));
  });
}

// Delete Note
exports.delCharNotes = function(req, res){
  db.query("DELETE FROM notes WHERE id = " + req.body.id + " AND charId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "')", (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not delete Note";
    }
    res.send(JSON.stringify(result));
  });
}