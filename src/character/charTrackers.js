var db = require("../dbcon.js");

// Get Trackers
exports.getCharTrackers = function(req, res){
  db.query("SELECT * FROM charTrackers WHERE charId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "')", (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not get Trackers";
    }
    res.send(JSON.stringify(result));
  });
}

exports.postCharTracker = function(req, res){
  db.query("INSERT INTO charTrackers VALUES (0, (SELECT id FROM characters WHERE charString = '" + req.params.charString + "'), '" + req.body.title + "', " + req.body.value + ", " + req.body.maxValue + ", " + req.body.minValue + ")", (result) => {
    let data = {};
    if(result["success"]) {
      res.status(200);
      data = {
        "id": result.insertId,
        "title": req.body.title,
        "value": req.body.trackValue,
        "maxValue": req.body.trackMax,
        "minValue": req.body.trackMin
      }
    }
    else{
      res.status(500);
      result["message"] = "Could not add Tracker";
    }
    res.send(JSON.stringify(result));
  });
}

exports.patchCharTracker = function(req, res){
  db.query("UPDATE charTrackers SET value = " + req.body.trackValue + " WHERE id = " + req.body.id + " AND charId = (SELECT id FROM characters WHERE charString = " + req.params.charString + ")", (result) => {
    if(result["success"]) res.status(200);
    else{
      res.status(500);
      result["message"] = "Could not update Tracker";
    }
    res.send(JSON.stringify(result));
  });
}