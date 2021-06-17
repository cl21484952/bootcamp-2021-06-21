const express = require("express")
const bodyparser = require("body-parser")
const mysql = require("mysql2")

const connection = mysql.createConnection({
  host: "tmp-mysql-db",
  user: "root",
  password: null,
})

const app = express()
app.use(bodyparser.json())
const port = 3000

// Endpoint
app.get(
  // Endpoint Path
  "/notepad",
  // Middleware
  (req, res) => {
    const httpCode = 200

    connection.query(`SELECT * FROM note`, (error, results) => {
      if (error) {
        throw error
      }
      res.status(httpCode).json(results)
    })
  },
)

app.get("/notepad/:id", (req, res) => {
  // Task 1: Find individual note
  // Requirement:
  // - Find note with given noteId
  // - If not found, return HTTP Code 404 and "Not Found"
  // - Return HTTP Code 200 and the note if found
  const noteId = parseInt(req.params.id)

  connection.query(`SELECT * FROM note WHERE id = ${noteId}`, (error, results) => {
    if (error) {
      throw error
    }
    if (results.length === 0) {
      res.status(404).send("Not Found")
      return
    }
    res.status(200).json(results[0])
  })
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
  connection.query(`INSERT INTO note (note) VALUES ('${rawJson.note}')`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send("OK")
  })
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

  connection.query(`SELECT * FROM note WHERE id = ${noteId}`, (error, results) => {
    if (error) {
      throw error
    }
    if (results.length === 0) {
      res.status(404).send("Not Found")
      return
    }
    connection.query(`DELETE FROM note WHERE id = ${noteId}`, (error) => {
      if (error) {
        throw error
      }
      res.status(200).send("OK")
    })
  })
})

// Task 4: clear all notes
// Requirement:
// - Set currentNote to null
// - Path: /notepad
// - HTTP Method: DELETE
// - HTTP Code 200 when currentNote is set to empty list
app.delete("/notepad/:id", (req, res) => {
  connection.query("TRUNCATE TABLE note", (error) => {
    if (error) {
      throw error
    }
    res.status(200).send("OK")
  })
})

connection.connect((error) => {
  if (error) {
    throw error
  }
  connection.query("SELECT 1 + 1 AS solution", function (error) {
    if (error) {
      throw error
    }
    connection.query("CREATE DATABASE IF NOT EXISTS db", (error) => {
      if (error) {
        throw error
      }
      connection.query("USE db", (error) => {
        if (error) {
          throw error
        }
        connection.query(
          "CREATE TABLE IF NOT EXISTS `note` (`id` INT PRIMARY KEY AUTO_INCREMENT,`note` NVARCHAR(140) NOT NULL);",
          (error) => {
            if (error) {
              throw error
            }
            app.listen(port, () => {
              console.log(`Example app listening at http://localhost:${port}`)
            })
          },
        )
      })
    })
  })
})
