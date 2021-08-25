//Application back end must store notes with unique IDs in a JSON file.
const fs = require('fs');
const path = require('path');
const express = require('express');
var uniqid = require('uniqid'); 
const PORT = process.env.PORT || 3001;
const app = express();
const notes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//api route
//===================================================
app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});

//data routes
//====================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//catch all must go last(wildcard, right?)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, notes);
    res.json(newNote);
  });

function createNewNote(body, notesArray) {
    //sets new notes a body of req from api post method
    const newNote = body;
    if (!Array.isArray(notesArray)){
        notesArray = [];
    }
    if (notesArray.length === 0){
        notesArray.push(0);
    }
    //set id of new body obj to uniqid
    //body.id = notesArray[0];
    body.id = uniqid();
    notesArray[0]++;
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let noteI = notesArray[i];

        if (noteI.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
              //
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

//listener goes last
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});