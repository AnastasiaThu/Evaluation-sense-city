const mongoose = require('mongoose');
const { questionSchema } = require('./question'); 


const scoringQuestionSchema = new mongoose.Schema({
  // question: {
  //   type: String,
  //   required: true,
  // }
  //question: questionSchema,
  question: {
    type: questionSchema,
    required: true,
  },
  score: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

const ScoringQuestion = mongoose.model('ScoringQuestion', scoringQuestionSchema);

module.exports = { ScoringQuestion, scoringQuestionSchema };
