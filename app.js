var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));

// Routers
var genRouter = express.Router();
var charRouter = express.Router();
var userRouter = express.Router();

app.use((req, res, next) => {
  res.set('Content-Type', 'application/json');
  next();
});

app.use('/dnd/general', genRouter);
app.use('/dnd/character', charRouter);
app.use('/dnd/user', userRouter);


// Import files
var checkData = require("./src/tests.js").checkData;

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
genRouter.get('/spells', checkData, (req, res) => general.getSpells(req, res));
genRouter.get('/spells/:offset/:limit/:filter?', checkData, (req, res) => general.getSpellsLimit(req, res));
genRouter.get('/spellSpec/:id', checkData, (req, res) => general.getSpellSpec(req, res));
genRouter.get('/alignments', checkData, (req, res) => general.getAlignments(req, res));
genRouter.get('/backgrounds', checkData, (req, res) => general.getBackgrounds(req, res));


// -----------------------------------------
//                 Character
// -----------------------------------------

// Character General
charRouter.get('/general/:sessionId/:charString', checkData, (req, res) => charGen.getCharGeneral(req, res));
charRouter.patch('/general/:sessionId/:charString', checkData, (req, res) => charGen.patchCharGeneral(req, res));

// Character Money
charRouter.get('/money/:sessionId/:charString', checkData, (req, res) => charMoney.getCharMoney(req, res));
charRouter.patch('/money/:sessionId/:charString', checkData, (req, res) => charMoney.patchCharMoney(req, res));

// Character Health
charRouter.get('/health/:sessionId/:charString', checkData, (req, res) => charHealth.getCharHealth(req, res));
charRouter.patch('/health/:sessionId/:charString', checkData, (req, res) => charHealth.patchCharHealth(req, res));

// Character Spells
charRouter.get('/checkSpell/:sessionId/:charString/:spellId', checkData, (req, res) => charSpells.checkCharSpell(req, res));
charRouter.get('/spells/:sessionId/:charString', checkData, (req, res) => charSpells.getCharSpells(req, res));
charRouter.get('/spells/:sessionId/:charString/:offset/:limit/:filter?', checkData, (req, res) => charSpells.getCharSpellsLimit(req, res));
charRouter.post('/spells/:sessionId/:charString', checkData, (req, res) => charSpells.postCharSpell(req, res));
charRouter.delete('/spells/:sessionId/:charString', checkData, (req, res) => charSpells.delCharSpell(req, res));

// Character Notes
charRouter.get('/notes/:sessionId/:charString', checkData, (req, res) => charNotes.getCharNotes(req, res));
charRouter.post('/notes/:sessionId/:charString', checkData, (req, res) => charNotes.postCharNotes(req, res));
charRouter.patch('/notes/:sessionId/:charString', checkData, (req, res) => charNotes.patchCharNotes(req, res));
charRouter.delete('/notes/:sessionId/:charString', checkData, (req, res) => charNotes.delCharNotes(req, res));

// Character Trackers
charRouter.get('/trackers/:sessionId/:charString', checkData, (req, res) => charTrackers.getCharTrackers(req, res));
charRouter.post('/trackers/:sessionId/:charString', checkData, (req, res) => charTrackers.postCharTracker(req, res));
charRouter.patch('/trackers/:sessionId/:charString', checkData, (req, res) => charTrackers.patchCharTracker(req, res));


// -----------------------------------------
//                  User
// -----------------------------------------

// Login/Register
userRouter.post('/login', checkData, (req, res) => userGeneral.login(req, res));
userRouter.post('/register', checkData, (req, res) => userGeneral.register(req, res));

// Character Information
userRouter.get('/charList/:sessionId', checkData, (req, res) => userChars.getCharList(req, res));
userRouter.post('/character/:sessionId', checkData, (req, res) => userChars.postChar(req, res));
userRouter.delete('/character/:sessionId', checkData, (req, res) => userChars.delChar(req, res));


app.listen(3004, () => {
  console.log('Listening port 3004');
});