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
var checkSanitize = require("./src/tests.js").checkSanitize;

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
genRouter.get('/spells', (req, res) => general.getSpells(req, res));
genRouter.get('/spells/:offset/:limit/:filter?', checkSanitize, (req, res) => general.getSpellsLimit(req, res));
genRouter.get('/spellSpec/:id', checkSanitize, (req, res) => general.getSpellSpec(req, res));
genRouter.get('/alignments', (req, res) => general.getAlignments(req, res));
genRouter.get('/backgrounds', (req, res) => general.getBackgrounds(req, res));


// -----------------------------------------
//                 Character
// -----------------------------------------

// Character General
charRouter.get('/general/:charString', checkData, (req, res) => charGen.getGeneral(req, res));
charRouter.patch('/general/:charString', checkData, (req, res) => charGen.patchGeneral(req, res));

// Character Money
charRouter.get('/money/:charString', checkData, (req, res) => charMoney.getMoney(req, res));
charRouter.patch('/money/:charString', checkData, (req, res) => charMoney.patchMoney(req, res));

// Character Health
charRouter.get('/health/:charString', checkData, (req, res) => charHealth.getHealth(req, res));
charRouter.patch('/health/:charString', checkData, (req, res) => charHealth.patchHealth(req, res));

// Character Spells
charRouter.get('/checkSpell/:charString/:id', checkData, (req, res) => charSpells.checkSpell(req, res));
charRouter.get('/spells/:charString', checkData, (req, res) => charSpells.getSpells(req, res));
charRouter.get('/spells/:charString/:offset/:limit/:filter?', checkData, (req, res) => charSpells.getSpellsLimit(req, res));
charRouter.post('/spells/:charString/:id', checkData, (req, res) => charSpells.postSpell(req, res));
charRouter.delete('/spells/:charString/:id', checkData, (req, res) => charSpells.deleteSpell(req, res));

// Character Notes
charRouter.get('/notes/:charString', checkData, (req, res) => charNotes.getNotes(req, res));
charRouter.post('/notes/:charString', checkData, (req, res) => charNotes.postNote(req, res));
charRouter.patch('/notes/:charString', checkData, (req, res) => charNotes.patchNote(req, res));
charRouter.delete('/notes/:charString/:id', checkData, (req, res) => charNotes.deleteNote(req, res));

// Character Trackers
charRouter.get('/trackers/:charString', checkData, (req, res) => charTrackers.getTrackers(req, res));
charRouter.post('/trackers/:charString', checkData, (req, res) => charTrackers.postTracker(req, res));
charRouter.patch('/trackers/:charString', checkData, (req, res) => charTrackers.patchTracker(req, res));
charRouter.delete('/trackers/:charString/:id', checkData, (req, res) => charTrackers.deleteTracker(req, res));


// -----------------------------------------
//                  User
// -----------------------------------------

// Login/Register
userRouter.post('/login', checkSanitize, (req, res) => userGeneral.login(req, res));
userRouter.post('/register', checkSanitize, (req, res) => userGeneral.register(req, res));

// Character Information
userRouter.get('/charList', checkData, (req, res) => userChars.getCharList(req, res));
userRouter.post('/character', checkData, (req, res) => userChars.postChar(req, res));
userRouter.delete('/character', checkData, (req, res) => userChars.delChar(req, res));


app.listen(3004, () => {
  console.log('Listening port 3004');
});