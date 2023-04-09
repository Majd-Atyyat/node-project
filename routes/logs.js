// route for retrieving logs
const express = require('express');
const RequestLog = require('../models/requestLog');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get('/logs', authenticate, async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const logs = await RequestLog.find().sort({ time: -1 }).skip(skip).limit(limit);
  const total = await RequestLog.countDocuments();

  res.json({
    logs,
    page,
    totalPages: Math.ceil(total / limit),
    totalLogs: total
  });
});

module.exports = router;
