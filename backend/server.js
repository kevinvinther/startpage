const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

const PORT = 3001;

app.use(cors());

// Create or connect to SQLite database
let db = new sqlite3.Database('./startpage.db');

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    link TEXT,
    color TEXT,
    category TEXT
)`);

app.use(express.json());

// Sample API endpoint to get all links
app.get('/links', (req, res) => {
        db.all("SELECT * FROM links", [], (err, rows) => {
                if (err) {
                        throw err;
                }
                res.json(rows);
        });
});



app.post('/links', (req, res) => {
        const { title, link, color, category } = req.body;

        if (!title || !link) {
                return res.status(400).json({ error: "Title and Link are required." });
        }

        const sql = "INSERT INTO links (title, link, color, category) VALUES (?, ?, ?, ?)";
        const params = [title, link, color, category];

        db.run(sql, params, function(err) {
                if (err) {
                        return res.status(400).json({ error: err.message });
                }

                // Return the last inserted id. In a real application, you might also return more info.
                return res.json({ id: this.lastID });
        });
});

app.put('/links/:id', (req, res) => {
        const { title, link, color, category } = req.body;
        const { id } = req.params;

        if (!title || !link) {
                return res.status(400).json({ error: "Title and Link are required." });
        }

        const sql = "UPDATE links SET title = ?, link = ?, color = ?, category = ? WHERE id = ?";
        const params = [title, link, color, category, id];

        db.run(sql, params, function(err) {
                if (err) {
                        return res.status(400).json({ error: err.message });
                }

                // Return the number of rows that were changed
                res.json({ changes: this.changes });
        });
});

app.delete('/links/:id', (req, res) => {
        const { id } = req.params;

        const sql = "DELETE FROM links WHERE id = ?";
        const params = [id];

        db.run(sql, params, function(err) {
                if (err) {
                        return res.status(400).json({ error: err.message });
                }

                // Return the number of rows that were deleted
                res.json({ changes: this.changes });
        });
});


app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
});

