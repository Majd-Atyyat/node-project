const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const logsRouter = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
   user: "postgres",
    password: "zatar123!",
    host: "interns.postgres.database.azure.com",
    port: 5432,
    database: "majd",
};

const JWT_SECRET = process.env.JWT_SECRET || "WIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hamFyZCIsImlhdC";
const pool = new pg.Pool(config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Create a middleware function to verify the JWT in the request header



function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


// GET all items
app.get('/models', authenticate, (req, res) => {
  pool.query('SELECT * FROM model', (err, result) => {
    if (err) {
      throw err;
    }

    res.send(result.rows);
  });
});

// GET one item by id
app.get('/models/:id', authenticate, (req, res) => {
  const id = req.params.id;

  pool.query(`SELECT * FROM model WHERE id = ${id}`, (err, result) => {
    if (err) {
      throw err;
    }

    res.send(result.rows);
  });
});

// POST a new item
app.post('/models', authenticate, (req, res) => {
  const { name, description } = req.body;

  pool.query(
    `INSERT INTO model (name, description) VALUES ('${name}', '${description}')`,
    (err, result) => {
      if (err) {
        throw err;
      }

      res.send(`model added with ID: ${result.insertId}`);
    }
  );
});

// PUT (update) an existing item
app.put('/models/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;

  pool.query(
    `UPDATE model SET name = '${name}', description = '${description}' WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        throw err;
      }

      res.send(`model with ID: ${id} updated`);
    }
  );
});

// DELETE an existing item
app.delete('/models/:id', authenticate, (req, res) => {
  const id = req.params.id;

  pool.query(`DELETE FROM model WHERE id = ${id}`, (err, result) => {
    if (err) {
      throw err;
    }

    res.send(`model with ID: ${id} deleted`);
  });
});

// Authorization 
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are valid
    if (username !== "admin" || password !== "password") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    // Generate a JWT with a payload containing the username and expiration date
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "100h" });
  
    // Return the JWT in the response
    res.json({ token });
  });

  app.use('/logs', authenticate, logsRouter);

  

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));