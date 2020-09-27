# API URLs
Every url precedes with `http://<ip>/dnd/`, appended by: 

<br />

## General `/general`
This URL extension contains multiple public calls that can be used without a sessionID or characterID. 

### `/spells/` 
Returns a list of all spells in the database. 

### `/spells/:offset/:limit/:filter?`
Returns a list of all spells with following parameters:
- offset: Spell ID with which to begin
- limit:  Amount of spells to return
- filter: String to filter the spells by name (optional)

### `/spellCount/:filter?`
Returns the number of spells in the database with following parameters:
- filter: String to filter the spells by name (optional)

### `/spellSpec/:id`
Returns more specific information about a spell. 
- id:  Id of the spell

### `/alignments`
Returns a list with all alignments.

### `/backgrounds`
Returns a list with all backgrounds.

### `/races`
Returns a list with all races.

### `/languages`
Returns a list with all languages. 

### Example URL
`http://<ip>/dnd/general/spells/0/50/"eldritch"`
Returns the first 50(or less) spells that contain the string "eldritch"

<br />

## Character `/character`
This URL extension contains multiple calls that can only be accessed with a valid sessionID and characterID. 

### `/general/:charString`
(Get / Update) general character information.
- charString: Unique identifier of the character

### `/money/:charString`
(Get / Update) character money values.
- charString: Unique identifier of the character

### `/health/:charString`
(Get / Update) character health values.
- charString: Unique identifier of the character

### `/checkSpell/:charString/:spellId`
(Get) boolean whether the specified character has learned a specific spell. 
- charString: Unique identifier of the character
- spellId:    Unique identifier of the spell

### `/spellCount/:charString/:filter?`
(Get) the amount of spells the character has.
- charString: Unique identifier of the character
- filter:     Spellname to check against

### `/spells/:charString`
(Get) all spells the character has learned
(Post) a new spell to the characters spellList
(Delete) a spell from the character spellList
- charString: Unique identifier of the character

### `/spells/:charString/:offset/:limit/:filter?`
Returns a list of spells the character knows with following parameters:
- charString: Unique identifier of the character
- offset:     spellId with which to begin
- limit:      Amount of spells to return
- filter:     string to filter the spells by name (optional)

### `/notes/:charString`
(Get / Add / Update) a character note.
- charString: Unique identifier of the character

### `/notes/:charString/:noteId`
(Delete) a character note.
- charString: Unique identifier of the character
- noteId:     Unique identifier of the note

### `/trackers/:charString`
(Get / Add / Update) a tracker value. 
- charString: Unique indentifier of the character

### `/trackers/:charString/:trackerId`
(Delete) a character tracker.
- charString: Unique identifier of the character
- trackerId:  Unique identifier of the tracker

### Example URL
`http://<ip>/dnd/character/spells/<charString>/0/50/"Eldritch"`
Returns the first 50(or less) spells of the character that contain the string "eldritch"

<br />

## User `/user`
This URL extension contains multiple calls that can only be accessed with a valid sessionId. 


### `/login`
(Post) login information and receive the sessionId as an answer. 

### `/register`
(Post) register values and receive the sesionId as an answer. 

### `/charList`
(Get) a list of all characters the user has made. The sessionId has to be sent in the http header. 

### `/character`
(Post / Delete) a new character to the users character list. The sessionId has to be sent in the http header. 

### Example URL
`http://<ip>/dnd/user/login`
Send the login data in the http body and receive the sessionId as a result.
