var connection = require("../dbcon.js").connection;

// Get Trackers
exports.getCharTrackers = function(req, res){
  connection.query("SELECT * FROM charTrackers WHERE charId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "')", (err, result) => {
    if(err){
      console.log(err);

      send(res, 500, false, "Could not get Trackers", undefined);
    }

    send(res, 200, true, "", result);
  });
}

exports.addCharTracker = function(req, res){
  connection.query("INSERT INTO charTrackers VALUES id, charId, title, value, maxValue, minValue", (err, result) => {
    if(err){
      console.log(err);

      send(res, 500, false, "Could not add Tracker", undefined);
    }

    let data = {
      "id": result.insertId,
      "title": req.body.title,
      "value": req.body.value,
      "maxValue": req.body.maxValue,
      "minValue": req.body.minValue
    }
    send(res, 200, true, "Successfully added Tracker", data)
  });
}

exports.patchCharTracker = function(req, res){
  connection.query("UPDATE charTracker SET value = value WHERE trackerId = trackerId AND charId = (SELECT id FROM characters WHERE charString = charString)", (err, result) => {
    if(err){
      console.log(err);

      send(res, 500, false, "Could not update Tracker", undefined);
    }

    send(res, 200, true, "Successfully added Tracker", undefined);
  });
}

function send(res, status, success, message, data){
  if(data === undefined) data = [];
  
  res.status(status);
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({
    "success": success,
    "message": message,
    "data": data
  }));
}