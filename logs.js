const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create a log schema and model
const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  method: String,
  url: String,
  status: Number,
  user: { type: String, default: 'anonymous' }
});
const Log = mongoose.model('Log', logSchema);

// Create a middleware function to verify the JWT in the request header
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Create a middleware function to log incoming requests
const logger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  skip: function (req, res) { return res.statusCode < 400 }
});

// Add a route to retrieve all logs
router.get('/logs', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const count = await Log.countDocuments();
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      logs,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      totalLogs: count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add the logger middleware to log incoming requests
router.use(logger);

module.exports = router;
