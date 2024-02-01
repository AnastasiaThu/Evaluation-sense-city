const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  label:{
    type: String,
  },
  type: {
    type: String,
    enum: ['text', 'scoring', 'date', 'demographics'],
    required: true,
  },
  options: [{
    type: String,
  }],
  scoreOptions: [{
    type: Number,
    min: 1,
    max: 5,
  }],
  required: {
    type: Boolean,
    default: true,
    required: true,
  },
  order: {
      type: Number,
      required: true,
    },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = {Question, questionSchema};

