const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql2")

const connection = mysql.createConnection({
  host: "temp-mysql",
  user: "root",
  password: "datability",
})

const app = express()
app.use(bodyparser.json())
app.use(cors())
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

  // Validate
  if (!rawJson.note) {
    res.status(400).send("Missing body property <note>!")
    return
  }
  if (!(typeof rawJson.note === "string")) {
    res.status(400).send("note property is not string!")
    return
  }

  if (!rawJson.title) {
    res.status(400).send("Missing body property <title>!")
    return
  }
  if (!(typeof rawJson.title === "string")) {
    res.status(400).send("title property is not string!")
    return
  }

  const createdAt = new Date()

  connection.query(
    `INSERT INTO note (note, title, createdAt, updatedAt) VALUES ('${rawJson.note}', '${
      rawJSON.title
    }', '${createdAt.toISOString.slice(0, 23)}', '${createdAt.toISOString.slice(0, 23)}')`,
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send("" + results[0].id)
    },
  )
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

  // Validate
  if (!rawJson.note) {
    res.status(400).send("Missing body property <note>!")
    return
  }
  if (!(typeof rawJson.note === "string")) {
    res.status(400).send("note property is not string!")
    return
  }

  if (!rawJson.title) {
    res.status(400).send("Missing body property <title>!")
    return
  }
  if (!(typeof rawJson.title === "string")) {
    res.status(400).send("title property is not string!")
    return
  }

  const createdAt = new Date()
  connection.query(`SELECT * FROM note WHERE id = ${noteId}`, (error, results) => {
    if (error) {
      throw error
    }
    if (results.length === 0) {
      res.status(404).send("Not Found")
      return
    }
    const updatedAtText = createdAt.toISOString.slice(0, 23)
    connection.query(
      `UPDATE note SET note = "${rawJson.note}", title = '${rawJson.title}', updatedAt = '${updatedAtText}' WHERE id = ${noteId}`,
      (error) => {
        if (error) {
          throw error
        }
        res.status(200).send("OK")
      },
    )
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

const databaseSQL = `
CREATE TABLE IF NOT EXISTS \`note\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`title\` NVARCHAR(140) NOT NULL,
  \`note\` NVARCHAR(140) NOT NULL DEFAULT '',
  \`createdAt\` DATETIME NOT NULL,
  \`updatedAt\` DATETIME NOT NULL,
  PRIMARY KEY (\`id\`))
`

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
        connection.query(databaseSQL, (error) => {
          if (error) {
            throw error
          }
          app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
          })
        })
      })
    })
  })
})
