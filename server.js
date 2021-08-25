//Application back end must store notes with unique IDs in a JSON file.
const fs = require('fs');
const path = require('path');
const express = require('express');
//for unique id 
var uniqid = require('uniqid'); 
//use port in case 3000 isnt available
const PORT = process.env.PORT || 3001;
const app = express();
const notes = require('./db/db.json');

//actions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//api route
//===================================================
app.get('/api/notes', //middleware: 
(req, res) => {
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

//catch all must go last(wildcard)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
//after getting everything, post new note to api
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, notes);
    res.json(newNote);
  });

  //function to create new note
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
    for (let i = 0; i < notesArray.length; i++){
        //index tracker variable
        let noteI = notesArray[i];
        //if selected note if found by id
        if (noteI.id === id) {
            //put a 1 as a placeholder
            notesArray.splice(i, 1);
            //update file
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
        }
              //leave loop
            break;
            //return;
     }
}

//designate route using id param
app.delete('/api/notes/:id', (req, res) => {
    //get id from body requested from notes[] to delete
    deleteNote(req.params.id, notes);
    res.json(true);
});

//listener goes last w dynamic value for port
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});