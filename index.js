const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
   user: "postgres",
    password: "zatar123!",
    host: "interns.postgres.database.azure.com",
    port: 5432,
    database: "majd",
};

const pool = new pg.Pool(config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET all items
app.get('/models', (req, res) => {
  pool.query('SELECT * FROM model', (err, result) => {
    if (err) {
      throw err;
    }

    res.send(result.rows);
  });
});

// GET one item by id
app.get('/models/:id', (req, res) => {
  const id = req.params.id;

  pool.query(`SELECT * FROM model WHERE id = ${id}`, (err, result) => {
    if (err) {
      throw err;
    }

    res.send(result.rows);
  });
});

// POST a new item
app.post('/models', (req, res) => {
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
app.put('/models/:id', (req, res) => {
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
app.delete('/items/:id', (req, res) => {
  const id = req.params.id;

  pool.query(`DELETE FROM model WHERE id = ${id}`, (err, result) => {
    if (err) {
      throw err;
    }

    res.send(`model with ID: ${id} deleted`);
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));