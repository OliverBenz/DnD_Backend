var connection = require("../dbcon.js").connection;

// Get all Notes
exports.getCharNotes = function(req, res){
  connection.query("SELECT id, date, note FROM notes WHERE charId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "') ORDER BY date DESC", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Notes" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
}

// Post new Note
exports.postCharNotes = function(req, res){
  connection.query("INSERT INTO notes VALUES (0, (SELECT id FROM characters WHERE charString = '" + req.params.charString + "'), '" + req.body.date + "', '" + req.body.note + "')", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not add note" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    let data = {
      "id": result.insertId,
      "date": req.body.date.split(" ")[0],
      "note": req.body.note
    }
    res.send(JSON.stringify({ "success": true, "data": data }));
  });
}

// Update existing Note
exports.patchCharNotes = function(req, res){
  connection.query("UPDATE notes SET note='" + req.body.note + "' WHERE id = " + req.body.id, (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not update Note" }));
    }
    
    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "message": "Successfully updated Note" }));
  });
}

// Delete Note
exports.delCharNotes = function(req, res){
  connection.query("DELETE FROM notes WHERE id = " + req.body.id, (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not delete Note" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "message": "Successfully deleted Note" }));
  });
}