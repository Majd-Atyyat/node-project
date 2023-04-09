// RequestLog model for MongoDB
const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  ip: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

const RequestLog = mongoose.model('RequestLog', requestLogSchema);

module.exports = RequestLog;
