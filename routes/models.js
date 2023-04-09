// routes for CRUD operations on models
const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/models', authenticate, (req, res) => {
  pool.query('SELECT * FROM model', (err, result) => {
    if (err) {
      throw err;
    }

    res.send(result.rows);
  });
});

router.get('/models/:id', authenticate, (req, res) => {
  const id = req.params.id;

  pool.query(`SELECT * FROM model WHERE id = ${id}`, (err, result) => {
    if (err) {
      throw err;
    }

    res.send(result.rows);
  });
});

router.post('/models', authenticate, (req, res) => {
    const { name, manufacturer } = req.body;
  
    pool.query(
      'INSERT INTO model (name, manufacturer) VALUES ($1, $2)',
      [name, manufacturer],
      (err, result) => {
        if (err) {
          throw err;
        }
  
        res.send('Model added successfully');
      }
    );
  });
  
