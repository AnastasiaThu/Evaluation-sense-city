const mongoose = require('mongoose');
const { questionSchema } = require('./question'); 

const textQuestionSchema = new mongoose.Schema({
    // question: {
    //    type: String,
    //   required: true,
    // },
    //question: questionSchema,
    question: {
      type: questionSchema,
      required: true,
    },
    answer: {
      type: String,
    },
  });

  const TextQuestion = mongoose.model('TextQuestion', textQuestionSchema);

  module.exports = { TextQuestion, textQuestionSchema };