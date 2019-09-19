var connection = require("../dbcon.js").connection;

// Get Trackers
exports.getCharTrackers = function(req, res){
  connection.query("SELECT * FROM charTrackers WHERE charId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "')", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Trackers" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
}