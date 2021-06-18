const express = require("express")
const bodyparser = require("body-parser")

const app = express()
app.use(bodyparser.json())
const port = 3000

const noteList = [
  { id: 1, note: "Good day" },
  { id: 2, note: "second day" },
]

// Endpoint
app.get(
  // Endpoint Path
  "/notepad",
  // Middleware
  (req, res) => {
    const httpCode = 200

    res.status(httpCode).json(noteList)
  },
)

app.get("/notepad/:id", (req, res) => {
  // Task 1: Find individual note
  // Requirement:
  // - Find note with given noteId
  // - If not found, return HTTP Code 404 and "Not Found"
  // - Return HTTP Code 200 and the note if found
  const noteId = parseInt(req.params.id)

  const note = noteList.find((ele) => ele.id === noteId)
  if (note === undefined) {
    res.status(404).send("Not Found")
    return
  }

  res.status(200).json(note)
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
  if (!(typeof rawJson.note === "string")) {
    res.status(400).send("note property is not string!")
    return
  }
  noteList.push({
    id: noteList.length + 1,
    note: rawJson.note,
  })
  res.status(201).send("OK")
})

// Task 5: Update individual notes
// Requirement:
// - HTTP Verb: PUT
// - Path: /notepad/:id
// - Body: { "note": "Update" }
// - Find note with given noteId
// - If not found, return HTTP Code 404 and "Not Found"
// - If found, the update note
// - Return HTTP Code 200 and "OK"
app.put("/notepad/:id", (req, res) => {
  const noteId = parseInt(req.params.id)
  const rawJson = req.body
  if (!rawJson.note) {
    res.status(400).send("Missing body property <note>!")
    return
  }
  if (!(typeof rawJson.note === "string")) {
    res.status(400).send("note property is not string!")
    return
  }

  const note = noteList.find((ele) => ele.id === noteId)
  if (note === undefined) {
    res.status(404).send("Not Found")
    return
  }
  note.note = rawJson.note

  res.status(200).send("OK")
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

  let foundIn = -1
  noteList.forEach((ele, index) => {
    if (ele.id === noteId) {
      foundIn = index
    }
  })
  if (foundIn === -1) {
    res.status(404).send("Not Found")
    return
  }

  noteList.filter((ele) => {
    if (ele.id === noteId) {
      return false
    }
    return true
  })

  res.status(200).send("OK")
})

// Task 4: clear all notes
// Requirement:
// - Set currentNote to null
// - Path: /notepad
// - HTTP Method: DELETE
// - HTTP Code 200 when currentNote is set to empty list
app.delete("/notepad", (req, res) => {
  noteList = []
  res.status(200).send("OK")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
