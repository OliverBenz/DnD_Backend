var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var bcrypt = require('bcryptjs');

var app = express();
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));


var general = require("./src/general.js");


// Routers
var dndRouter = express.Router();
app.use('/dnd', dndRouter);

// MySQL Setup
var mysql = require('mysql');
// var dbconfig = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'dnd'
// };

var dbconfig = {
  host: '172.17.0.1',
  user: 'dnd',
  password: 'B71x!#rOWv$WH3&!2ltu43Y*nW3@7J',
  port: '3306',
  database: 'dnd'
};
var connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbconfig);

  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();


// -----------------------------------------
//                 General
// -----------------------------------------

// Get Spells
dndRouter.get('/getSpells', (req, res) => {
  connection.query("SELECT s.id, s.name, s.level, s.range from spells s ORDER BY name ASC", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({"success": false, "message": "Could not get Spells" }))
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
});

dndRouter.get('/spellSpec/:id', (req, res) => {
  connection.query("SELECT * FROM spells WHERE id = " + req.params.id, (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Spell Information" }));
    }
    else{
      res.status(200);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": true, "data": result }));
    }
  });
});

// Get Alignments
dndRouter.get('/alignments', (req, res) => general.getAlignments);

// Get Backgrounds
dndRouter.get('/backgrounds', (req, res) => {
  connection.query("SELECT id, name FROM backgrounds", (err, result) => {
    if(err){
      console.log(err);
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Backgrounds" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
});

// -----------------------------------------
//            Character General
// -----------------------------------------

dndRouter.get('/charGeneral/:sessionId/:charString', checkUserCharacter, (req, res) => {
  connection.query("SELECT c.firstname, c.lastname, c.level, c.xp, a.name, c.background, c.age, c.height, weight FROM characters c INNER JOIN alignments a ON a.id = c.alignment WHERE c.charString='" + req.params.charString + "' AND c.userId = (SELECT id from users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Character Information" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result[0]}));
  });
});

dndRouter.patch('/charGeneral/:sessionId/:charString', checkUserCharacter, (req, res) => {
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

dndRouter.get('/charMoney/:sessionId/:charString', checkUserCharacter, (req, res) => {
  connection.query("SELECT copper, silver, electrum, gold, platinum from characters WHERE charString = '" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Character Money" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result[0]}));
  });
});

dndRouter.patch('/charMoney/:sessionId/:charString', checkUserCharacter, (req, res) => {
  connection.query("UPDATE characters SET copper = " + req.body.copper + ", silver = " + req.body.silver + ", electrum = " + req.body.electrum + ", gold = " + req.body.gold + ", platinum = " + req.body.platinum + " WHERE charString = '" + req.params.charString + "'", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "message": "Update successful" }));
  });
});


// -----------------------------------------
//            Character Health
// -----------------------------------------

dndRouter.get('/charHealth/:sessionId/:charString', checkUserCharacter, (req, res) => {
  connection.query("SELECT maxHealth, currentHealth, tempHealth from characters WHERE charString = '" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);

      res.status(500);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Could not get Character Health" }));
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result[0]}));
  });
});

dndRouter.patch('/charHealth/:sessionId/:charString', checkUserCharacter, (req, res) => {
  connection.query("UPDATE characters SET maxHealth = " + req.body.maxHealth + ", currentHealth = " + req.body.currentHealth + ", tempHealth = " + req.body.tempHealth + " WHERE charString = '" + req.params.charString + "'", (err, result) => {
    if(err){
      console.log(err);
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "message": "Update successful" }));
  });
});


// -----------------------------------------
//            Character Spells
// -----------------------------------------

dndRouter.get('/checkCharSpell/:sessionId/:charString/:spellId', checkUserCharacter, (req, res) => {
  connection.query("SELECT * FROM charSpells WHERE characterId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "') AND spellId = " + req.params.spellId, (err, result) => {
    if(err){
      console.log(err); 
    }
    
    if(result.length === 1){
      res.status(200);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": true, "data": true }));
    }
    else{
      res.status(200);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": true, "data": false }));
    }
  });
});

dndRouter.get('/charSpells/:sessionId/:charString', checkUserCharacter, (req, res) => {
  connection.query("SELECT s.id, s.name, s.level, s.range FROM charSpells c INNER JOIN spells s ON c.spellId = s.id WHERE c.characterId = (SELECT id from characters ch WHERE ch.charString = '" + req.params.charString + "' AND ch.userId = (SELECT id FROM users WHERE sessionId = '" + req.params.sessionId + "'))", (err, result) => {
    if(err){
      console.log(err);
    };

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
});

dndRouter.post('/charSpells/:sessionId/:charString', checkUserCharacter, (req, res) => {
  connection.query("INSERT INTO charSpells VALUES ((SELECT id FROM characters WHERE charString = '" + req.params.charString + "'), " + req.body.spellId + ")", (err, result) => {
    if(err) console.log(err);

    res.status(200);
    res.set('Content-Type', 'application/json');
    // Data is the userHasSpell Attribute in Frontend -> True means user has spell
    res.send(JSON.stringify({ "success": true, "message": "Successfully Added Spell", "data": true }));
  });
});

dndRouter.delete('/charSpells/:sessionId/:charString', checkUserCharacter, (req, res) => {
  connection.query("DELETE FROM charSpells WHERE characterId = (SELECT id FROM characters WHERE charString = '" + req.params.charString + "') AND spellId = " + req.body.spellId, (err, result) => {
    if(err) console.log(err);

    res.status(200);
    res.set('Content-Type', 'application/json');
    // Data is the userHasSpell Attribute in Frontend -> False means user doesn't have spell
    res.send(JSON.stringify({ "success": true, "message": "Successfully Removed Spell", "data": false }));
  });
});


// -----------------------------------------
//            Character Notes
// -----------------------------------------
dndRouter.get('/charNotes/:sessionId/:charString', checkUserCharacter, (req, res) => {
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
});

dndRouter.post('/charNotes/:sessionId/:charString', checkUserCharacter, (req, res) => {
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
});

dndRouter.patch('/charNotes/:sessionId/:charString', checkUserCharacter, (req, res) => {
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
});

dndRouter.delete('/charNotes/:sessionId/:charString', checkUserCharacter, (req, res) => {
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
});


// -----------------------------------------
//            Character Trackers
// -----------------------------------------
dndRouter.get('/charTrackers/:sessionId/:charString', checkUserCharacter, (req, res) => {
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
    res.send(JSON.stringify({ "success": true, "data": result }));
  });
});

dndRouter.post('/userLogin', (req, res) => {
  connection.query("SELECT password FROM users WHERE email='" + req.body.email + "'", (err, result) => {
    if(err){
      console.log(err);
    };

    if(result.length === 0){
      res.status(401);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Invalid E-Mail"}));
    }
    else{
      if(bcrypt.compareSync(req.body.password, result[0]["password"])){
        connection.query("SELECT sessionId FROM users WHERE email='" + req.body.email + "'", (err, result) => {
          res.status(200);
          res.set('Content-Type', 'application/json');
          res.send(JSON.stringify({ "success": true, "data": result[0] }));
        });
      }
      else{
        res.status(401);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "Invalid password"}));
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
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "User already registered"}));
      }
    } 

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": sessionId }));
  });
});

// Create new Character
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
        // res.status()
      }
      else{
        console.log(err);

        res.status(409);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "Char already registered"}));
      }
    }

    res.status(200);
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ "success": true, "data": { "charString": charString }}));
  });
});

// Delete Character
dndRouter.delete('/userChar/:sessionId', (req, res) => {
  // Check password
    connection.query("SELECT password FROM users WHERE sessionId='" + req.params.sessionId + "'", (err, result) => {
    if(err){
      console.log(err);
    };

    if(result.length === 0){
      res.status(401);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ "success": false, "message": "Invalid SessionId"}));
    }
    else{
      // If password correct
      if(bcrypt.compareSync(req.body.password, result[0]["password"])){
        connection.query('DELETE FROM characters WHERE charString = "' + req.body.charString + '" AND userId = (SELECT id FROM users WHERE sessionId = "' + req.params.sessionId + '")', (err, result) => {
          if(err){
            console.log(err);
            res.status(500);
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({ "success": false, "message": "Could not delete Character" }));
          }

          res.status(200);
          res.set('Content-Type', 'application/json');
          res.send(JSON.stringify({ "success": true, "message": "Deletion successful" }));
        });        
      }
      else{
        res.status(401);
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({ "success": false, "message": "Invalid password" }));
      }
    }
  });
});


// Testing function
function checkUserCharacter(req, res, next){
  // Check if user/char exist and are connected
  connection.query("SELECT id FROM characters WHERE charString='" + req.params.charString + "' AND userId = (SELECT id FROM users WHERE sessionId='" + req.params.sessionId + "')", (err, result) => {
    if(err){
      console.log(err);
    };

    if(result.length === 0){
      res.status(401);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({"message": "Wrong CharacterId / SessionId"}));
    }
    else{
      next();
    }
  });
}


app.listen(3004, () => {
  console.log('Listening port 3004');
});