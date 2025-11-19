// server/server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

// 1. Middleware (Setup)
app.use(cors()); // Allows your frontend to talk to this backend
app.use(express.json()); // Allows you to handle JSON data sent from frontend

// 2. Database Setup (Connect to SQLite)
// This creates a file named 'notes.db' if it doesn't exist
const db = new sqlite3.Database('./notes.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create the "notes" table automatically
        db.run(`CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Notes table is ready.');
            }
        });
    }
});

// 3. A Simple Test Route
app.get('/', (req, res) => {
    res.send('Hello! The Notes Backend is running.');
});

// --- API ENDPOINTS ---

// 1. GET all notes (Read)
app.get('/api/notes', (req, res) => {
    // "SELECT * FROM notes" means: Get everything from the notes table
    db.all("SELECT * FROM notes", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Send the rows (an array of notes) back to the frontend
        res.json(rows);
    });
});

// 2. POST a new note (Create)
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    
    // "INSERT INTO..." adds a new row. 
    // The '?' are placeholders for security (prevents hackers messing with your DB)
    const sql = "INSERT INTO notes (title, content) VALUES (?, ?)";
    
    db.run(sql, [title, content], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Send back the new note including its new ID
        res.json({ id: this.lastID, title, content });
    });
});

// 3. DELETE a note (Delete)
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    
    db.run("DELETE FROM notes WHERE id = ?", id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Deleted", changes: this.changes });
    });
});

// 4. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});