'use strict';



connection.connect(function(err){
  if(err) throw err;
  console.log("Connected to Database");
});

module.exports = connection;