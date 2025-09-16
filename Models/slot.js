// models/slot.js

const mongoose = require('mongoose');

const slotSchema = mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctors',
    required: true,
  },
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true,
  },
  startTime: {
    type: String, // '09:00'
    required: true,
  },
  endTime: {
    type: String, // '09:30'
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  }
});

const SlotModel = mongoose.model('Slots', slotSchema);
module.exports = SlotModel;
