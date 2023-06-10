import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Note from "./Note";
import CreateArea from "./CreateArea";
import FileUploader from "./FileUploader";
import LoginButton from './LoginButton';


import { levup } from "../../../declarations/levup";

function App() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      levup.createNote(newNote.title, newNote.content);
      return [newNote, ...prevNotes ]; //update frontend
    });
  }

  useEffect(() => {
    console.log("useEffect is triggered");
    fetchData();
  }, [])

  async function fetchData(){
    const notesArray = await levup.getNotes();
    setNotes(notesArray)
  }

  function deleteNote(id) {
    levup.removeNote(id);
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Navbar />
      <LoginButton />
      <CreateArea onAdd={addNote} />
      <FileUploader />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
