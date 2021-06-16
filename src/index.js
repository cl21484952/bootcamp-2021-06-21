const express = require("express")
const bodyparser = require("body-parser")

const app = express()
app.use(bodyparser.json())
const port = 3000

// Keep track of note
let currentNote = [
  {
    id: 1,
    note: "My First note!",
  },
]

// Endpoint
app.get(
  // Endpoint Path
  "/notepad",
  // Middleware
  (req, res) => {
    const httpCode = 200
    const responseBody = currentNote

    res.status(httpCode).json(responseBody)
  },
)

app.get("/notepad/:id", (req, res) => {
  // Task 1: Find individual note
  // Requirement:
  // - Find note with given noteId
  // - If not found, return HTTP Code 404 and "Not Found"
  // - Return HTTP Code 200 and the note if found
  const noteId = parseInt(req.params.id)
  const foundNote = currentNote.find((note) => {
    return note.id === noteId
  })
  if (!foundNote) {
    res.status(404).send("Not Found")
    return
  }
  res.status(200).json(foundNote)
})

app.post("/notepad", (req, res) => {
  // Task 2: Create a new note
  // Requirement:
  // - Check if request body have json and have "note" attribute
  //   - If missing, return HTTP Code 400 and "Missing body property <note>!"
  // - Check if "note" attribute is type of string
  //   - If missing, return HTTP Code 400 and "note property is not string!"
  // - Then create a new note object and pust in to currentNote variable
  const rawJson = req.body
  if (!rawJson.note) {
    res.status(400).send("Missing body property <note>!")
    return
  }
  if (!(rawJson.note instanceof String)) {
    res.status(400).send("note property is not string!")
    return
  }
  const noteObj = {
    id: Math.floor(Math.random() * 2 ** 31),
    note: rawJson.note,
  }
  currentNote.push(noteObj)

  res.status(201).send("OK")
})

// Task 3: Delete note from currentNote
// Requirement:
// - HTTP Verb: DELETE
// - path: /notepad/:id
// - Given ID
// - Find the note, if not found, return HTTP Code 404 and "No such Note!"
// - If Found, remove the note from the array
app.delete("/notepad/:id", (req, res) => {
  const noteId = parseInt(req.params.id)

  const foundNote = currentNote.find((note) => {
    return note.id === noteId
  })
  if (!foundNote) {
    res.status(404).send("No such Note!")
    return
  }

  currentNote = currentNote.filter((note) => {
    return note.id !== noteId
  })
  res.status(200).send("OK")
})

// Task 4: clear all notes
// Requirement:
// - Set currentNote to null
// - Path: /notepad
// - HTTP Method: DELETE
// - HTTP Code 200 when currentNote is set to empty list
app.delete("/notepad/:id", (req, res) => {
  currentNote = []
  res.status(200).send("OK")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
