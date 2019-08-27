var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));

// Routers
var dndRouter = express.Router();
app.use('/dnd', dndRouter);

// MySQL Setup
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dnd'
});



// Get Spells
dndRouter.get('/getSpells', (req, res) => {
  connection.query("SELECT * from spells", (err, result) => {
    if(err) throw err;

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });
});

// -----------------------------------------
//            Character General
// -----------------------------------------

dndRouter.get('/charGeneral/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("SELECT c.firstname, c.lastname, c.level, c.xp, a.name, c.background, c.age, c.height, weight FROM characters c INNER JOIN alignments a ON a.id = c.alignment WHERE c.charString='" + req.params.charId + "' AND c.userId = (SELECT id from users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err) throw err;  

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result[0]));
  });
});

dndRouter.patch('/charGeneral/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("UPDATE characters SET xp", (err, result) => {
    if(err) throw err;
  
    // TODO: IMPLEMENT patch character XP and level(if XP at certain value)
  });
});


// -----------------------------------------
//            Character Money
// -----------------------------------------

dndRouter.get('/charMoney/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("SELECT copper, silver, electrum, gold, platinum from characters WHERE charString = '" + req.params.charId + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err) throw err;

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result[0]));
  });  
});

dndRouter.patch('/charMoney/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("UPDATE characters SET copper = " + req.body.copper + ", silver = " + req.body.silver + ", electrum = " + req.body.electrum + ", gold = " + req.body.gold + ", platinum = " + req.body.platinum + " WHERE charString = '" + req.params.charId + "'", (err, result) => {
    if(err) throw err;

    res.status(200);
    res.send("Update successful");
  });  
});


// -----------------------------------------
//            Character Health
// -----------------------------------------

dndRouter.get('/charHealth/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("SELECT maxHealth, currentHealth, tempHealth from characters WHERE charString = '" + req.params.charId + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err) throw err;

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result[0]));
  });
});

dndRouter.patch('/charHealth/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("UPDATE characters SET maxHealth = " + req.body.maxHealth + ", currentHealth = " + req.body.currentHealth + ", tempHealth = " + req.body.tempHealth + " WHERE charString = '" + req.params.charId + "'", (err, result) => {
    if(err) throw err;

    res.status(200);
    res.send("Update successful");
  });
});


// -----------------------------------------
//            Character Spells
// -----------------------------------------

dndRouter.get('/charSpells/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("SELECT s.* FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '" + req.params.charId + "' AND ch.userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "'))", (err, result) => {
    if(err) throw error;

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });
});


// Testing function
function checkUserCharacter(req, res, next){
  connection.query("SELECT id FROM characters WHERE charString='" + req.params.charId + "' AND userId = (SELECT id FROM users WHERE sessionId='" + req.params.sessionId + "')", (err, result) => {
    if(err) throw err;

    if(result.length === 0){
      res.status(401);
      res.send("Wrong CharacterId / SessionId");
    }
    else{
      next();
    }
  });
}


app.listen(3004, () => {
  console.log('Listening port 3004');
});