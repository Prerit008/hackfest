// Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  athletes: { type: Array, required: true },
  status: { type: String, default: 'Upcoming' }, // Upcoming, Ongoing, Completed
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
