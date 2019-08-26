var express = require('express');
var app = express();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dnd'
});

app.get('/getSpells', (req, res) => {
  if(req.method == "GET"){
    connection.query("SELECT * from spells", (err, result) => {
      if(err) throw err;

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
    });
  }
  else{
    res.status(500);
    res.send("Unexpected Method");
  }
});

app.get('/charGeneral/:sessionId/:charId', (req, res) => {
  if(req.method == "GET"){
    connection.query("SELECT c.firstname, c.lastname, c.level, c.xp, a.name, c.background, c.age, c.height, weight FROM characters c INNER JOIN alignments a ON a.id = c.alignment WHERE c.charString='" + req.params.charId + "' AND c.userId = (SELECT id from users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
      if(err) throw err;  

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(result[0]));
    });
  }
  else if(req.method == "POST"){
    res.status(501);
    res.send("Not implemented");
  }
  else{
    res.status(500);
    res.send("Unexpected case");
  }

});

app.get('/charMoney/:sessionId/:charId', (req, res) => {
  if(req.method == "GET"){
    connection.query("SELECT copper, silver, electrum, gold, platinum from characters WHERE charString = '" + req.params.charId + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
      if(err) throw err;

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(result[0]));
    });
  }
  else if(req.method == "POST"){
    res.status(501);
    res.send("Not implemented");
  }
  else{
    res.status(500);
    res.send("Unexpected case");
  }
  
});

app.get('/charHealth/:sessionId/:charId', (req, res) => {
  if(req.method == "GET"){
    connection.query("SELECT maxHealth, currentHealth, tempHealth from characters WHERE charString = '" + req.params.charId + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
      if(err) throw err;

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(result[0]));
    });
  }
  else if(req.method == "POST"){
    res.status(501);
    res.send("Not implemented");
  }
  else{
    res.status(500);
    res.send("Unexpected case");
  }
  
});

app.get('/charSpells/:sessionId/:charId', (req, res) => {
  if(req.method == "GET"){
    connection.query("SELECT s.* FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '" + req.params.charId + "' AND ch.userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "'))", (err, result) => {
      if(err) throw error;

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
    });
  }
});



app.listen(3004, () => {
  console.log('Listening port 3004');
});