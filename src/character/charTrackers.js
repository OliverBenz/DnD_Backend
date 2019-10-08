var db = require("../dbcon.js");

// Get Trackers
exports.getTrackers = function(req, res){
  db.query(`SELECT * FROM charTrackers WHERE charId = (SELECT id FROM characters WHERE charString = '${req.params.charString}')`, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not get Trackers";
    }
    res.send(JSON.stringify(result));
  });
}

exports.postTracker = function(req, res){
  const { title, trackValue, trackMax, trackMin } = req.body;

  db.query(`INSERT INTO charTrackers VALUES (0, (SELECT id FROM characters WHERE charString = '${req.params.charString}'), '${title}', ${trackValue}, ${trackMax}, ${trackMin})`, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not add Tracker";
    }
    res.send(JSON.stringify(result));
  });
}

exports.patchTracker = function(req, res){
  const { trackValue, id } = req.body;

  db.query(`UPDATE charTrackers SET value = ${trackValue} WHERE id = ${id} AND charId = (SELECT id FROM characters WHERE charString = '${req.params.charString}')`, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Could not update Tracker";
    }
    res.send(JSON.stringify(result));
  });
}

exports.deleteTracker = function(req, res){
  const { charString, id } = req.params;
  db.query(`DELETE FROM charTrackers WHERE id = ${id} AND charId = (SELECT id FROM characters WHERE charString='${charString}')`, (result) => {
    if(result.success) res.status(200);
    else{
      res.status(500);
      result.message = "Coult not delete Tracker";
    }
    res.send(JSON.stringify(result));
  });
}