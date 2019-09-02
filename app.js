var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var bcrypt = require('bcryptjs');

var app = express();
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));

// Routers
var dndRouter = express.Router();
app.use('/dnd', dndRouter);

// MySQL Setup
var mysql = require('mysql');
// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'dnd'
// });
var connection = mysql.createConnection({
  host: '172.17.0.1',
  user: 'dnd',
  password: 'B71x!#rOWv$WH3&!2ltu43Y*nW3@7J',
  port: '3306',
  database: 'dnd'
});



// Get Spells
dndRouter.get('/getSpells', (req, res) => {
  connection.query("SELECT * from spells", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });
});

// Get Alignments
dndRouter.get('/alignments', (req, res) => {
  connection.query("SELECT id, name FROM alignments", (err, result) =>{
    if(err){
      console.log(err);
    }

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
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result[0]));
  });
});

dndRouter.patch('/charGeneral/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("UPDATE characters SET xp", (err, result) => {
    if(err){
      console.log(err);
    }

    // TODO: IMPLEMENT patch character XP and level(if XP at certain value)
  });
});


// -----------------------------------------
//            Character Money
// -----------------------------------------

dndRouter.get('/charMoney/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("SELECT copper, silver, electrum, gold, platinum from characters WHERE charString = '" + req.params.charId + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result[0]));
  });  
});

dndRouter.patch('/charMoney/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("UPDATE characters SET copper = " + req.body.copper + ", silver = " + req.body.silver + ", electrum = " + req.body.electrum + ", gold = " + req.body.gold + ", platinum = " + req.body.platinum + " WHERE charString = '" + req.params.charId + "'", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.send("Update successful");
  });  
});


// -----------------------------------------
//            Character Health
// -----------------------------------------

dndRouter.get('/charHealth/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("SELECT maxHealth, currentHealth, tempHealth from characters WHERE charString = '" + req.params.charId + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result[0]));
  });
});

dndRouter.patch('/charHealth/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("UPDATE characters SET maxHealth = " + req.body.maxHealth + ", currentHealth = " + req.body.currentHealth + ", tempHealth = " + req.body.tempHealth + " WHERE charString = '" + req.params.charId + "'", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.send("Update successful");
  });
});


// -----------------------------------------
//            Character Spells
// -----------------------------------------

dndRouter.get('/charSpells/:sessionId/:charId', checkUserCharacter, (req, res) => {
  connection.query("SELECT s.* FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '" + req.params.charId + "' AND ch.userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "'))", (err, result) => {
    if(err){
      console.log(err);
    };

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });
});


// -----------------------------------------
//                  User
// -----------------------------------------

dndRouter.get('/charList/:sessionId', (req, res) => {
  connection.query("SELECT firstname, lastname, level, charString from characters WHERE userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);
    };

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });
});

dndRouter.post('/userLogin', (req, res) => {
  connection.query("SELECT password FROM users WHERE email='" + req.body.email + "'", (err, result) => {
    if(err){
      console.log(err);
    };

    if(result.length === 0){
      res.status(401);
      res.send("Wrong E-Mail");
    }
    else{
      if(bcrypt.compareSync(req.body.password, result[0]["password"])){
        connection.query("SELECT sessionId FROM users WHERE email='" + req.body.email + "'", (err, result) => {
          res.status(200);
          res.send(JSON.stringify(result[0]));
        });
      }
      else{
        res.status(401);
        res.send("Wrong password")
      }
    }
  });
});

dndRouter.post('/userRegister', (req, res) => {
  let sessionId = bcrypt.hashSync(req.body.firstname + req.body.email, 12).split("/").join("");

  connection.query("INSERT INTO users VALUES (0, '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.email + "', '" + bcrypt.hashSync(req.body.password, 12) + "', '" + sessionId + "')", (err, result) => {
    if(err){
      console.log(err.errno);
      // Duplicate entry
      if(err.errno == 1062){
        res.status(409);
        res.send("User already registered");
      }
    } 

    res.status(200);
    res.send(JSON.stringify(sessionId));
  });
});

// TODO: Test if works
dndRouter.post('/userChar/:sessionId', (req, res) => {
  let charString = bcrypt.hashSync(String(Math.random()) , 12).substring(5, 20);

  var sql = "INSERT INTO characters VALUES (0, '" + charString + "', ";
  
  sql += "(SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "'), ";
  
  sql += "'" + req.body.firstname + "', '" + req.body.lastname + "', " + req.body.level + ", " + req.body.xp + ", ";
  sql += req.body.alignment + ", '" + req.body.background + "', " + req.body.age + ", " + req.body.height + ", " + req.body.weight + ", ";
  sql += req.body.maxHealth + ", " + req.body.tempHealth + ", " + req.body.currentHealth + ", ";
  sql += req.body.copper + ", " + req.body.silver + ", " + req.body.electrum + ", " + req.body.gold + ", " + req.body.platinum + ")";

  connection.query(sql, (err, result) => {
    if(err){
      if(err.errno === 1062){
        // this.insertNewChar(sql);
      }
      else{
        console.log(err);
        res.status(409);
        res.send("Char already registered");
      }
    }

    res.status(200);
    res.send(charString);
  });
});


// Testing function
function checkUserCharacter(req, res, next){
  // Check if user/char exist and are connected
  connection.query("SELECT id FROM characters WHERE charString='" + req.params.charId + "' AND userId = (SELECT id FROM users WHERE sessionId='" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);
    };

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