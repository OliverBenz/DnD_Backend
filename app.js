var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));

// Routers
var dndRouter = express.Router();
app.use('/dnd', dndRouter);

// Import files
var checkUserCharacter = require("./src/tests.js").checkUserCharacter;

var general = require("./src/general.js");

var charGen = require("./src/character/charGeneral.js");
var charMoney = require("./src/character/charMoney.js");
var charHealth = require("./src/character/charHealth.js");
var charSpells = require("./src/character/charSpells.js");
var charNotes = require("./src/character/charNotes.js");
var charTrackers = require("./src/character/charTrackers.js")

var userChars = require("./src/user/userChars.js");
var userGeneral = require("./src/user/userGeneral.js");


// -----------------------------------------
//                 General
// -----------------------------------------
dndRouter.get('/spells', (req, res) => general.getSpells(req, res));
dndRouter.get('/spells/:offset/:limit', (req, res) => general.getSpellsLimit(req, res));
dndRouter.get('/spellSpec/:id', (req, res) => general.getSpellSpec(req, res));
dndRouter.get('/alignments', (req, res) => general.getAlignments(req, res));
dndRouter.get('/backgrounds', (req, res) => general.getBackgrounds(req, res));


// -----------------------------------------
//                 Character
// -----------------------------------------

// Character General
dndRouter.get('/charGeneral/:sessionId/:charString', checkUserCharacter, (req, res) => charGen.getCharGeneral(req, res));
dndRouter.patch('/charGeneral/:sessionId/:charString', checkUserCharacter, (req, res) => charGen.patchCharGeneral(req, res));

// Character Money
dndRouter.get('/charMoney/:sessionId/:charString', checkUserCharacter, (req, res) => charMoney.getCharMoney(req, res));
dndRouter.patch('/charMoney/:sessionId/:charString', checkUserCharacter, (req, res) => charMoney.patchCharMoney(req, res));

// Character Health
dndRouter.get('/charHealth/:sessionId/:charString', checkUserCharacter, (req, res) => charHealth.getCharHealth(req, res));
dndRouter.patch('/charHealth/:sessionId/:charString', checkUserCharacter, (req, res) => charHealth.patchCharHealth(req, res));

// Character Spells
dndRouter.get('/checkCharSpell/:sessionId/:charString/:spellId', checkUserCharacter, (req, res) => charSpells.checkCharSpell(req, res));
dndRouter.get('/charSpells/:sessionId/:charString', checkUserCharacter, (req, res) => charSpells.getCharSpells(req, res));
dndRouter.post('/charSpells/:sessionId/:charString', checkUserCharacter, (req, res) => charSpells.postCharSpell(req, res));
dndRouter.delete('/charSpells/:sessionId/:charString', checkUserCharacter, (req, res) => charSpells.delCharSpell(req, res));

// Character Notes
dndRouter.get('/charNotes/:sessionId/:charString', checkUserCharacter, (req, res) => charNotes.getCharNotes(req, res));
dndRouter.post('/charNotes/:sessionId/:charString', checkUserCharacter, (req, res) => charNotes.postCharNotes(req, res));
dndRouter.patch('/charNotes/:sessionId/:charString', checkUserCharacter, (req, res) => charNotes.patchCharNotes(req, res));
dndRouter.delete('/charNotes/:sessionId/:charString', checkUserCharacter, (req, res) => charNotes.delCharNotes(req, res));

// Character Trackers
dndRouter.get('/charTrackers/:sessionId/:charString', checkUserCharacter, (req, res) => charTrackers.getCharTrackers(req, res));


// -----------------------------------------
//                  User
// -----------------------------------------

// Login/Register
dndRouter.post('/userLogin', (req, res) => userGeneral.login(req, res));
dndRouter.post('/userRegister', (req, res) => userGeneral.register(req, res));

// Character Information
dndRouter.get('/charList/:sessionId', (req, res) => userChars.getCharList(req, res));
dndRouter.post('/userChar/:sessionId', (req, res) => userChars.postChar(req, res));
dndRouter.delete('/userChar/:sessionId', (req, res) => userChars.delChar(req, res));


app.listen(3004, () => {
  console.log('Listening port 3004');
});