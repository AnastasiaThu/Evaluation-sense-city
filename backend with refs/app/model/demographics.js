const mongoose = require('mongoose');

const demographicsSchema = new mongoose.Schema({
  gender: {
    "Γυναίκα": {
      type: Number,
      default: 0,
    },
    "Άντρας": {
      type: Number,
      default: 0,
    },
  },
  ageGroup: {
    "<18": {
      type: Number,
      default: 0,
    },
    "18-25": {
      type: Number,
      default: 0,
    },
    "25-35": {
      type: Number,
      default: 0,
    },
    "35-45": {
      type: Number,
      default: 0,
    },
    "45-60": {
      type: Number,
      default: 0,
    },
    ">60": {
      type: Number,
      default: 0,
    },
  },
  educationLevel: {
    "Φοιτητής": {
      type: Number,
      default: 0,
    },
    "Υπάλληλος": {
      type: Number,
      default: 0,
    },
    "Άνεργος": {
      type: Number,
      default: 0,
    },
  },
  contact: {
    "Γνωστός": {
      type: Number,
      default: 0,
    },
    "Διαδίκτυο": {
      type: Number,
      default: 0,
    },
    "Άλλο": {
      type: Number,
      default: 0,
    },
  },
});

const Demographics = mongoose.model('Demographics', demographicsSchema);

module.exports = { Demographics, demographicsSchema };
