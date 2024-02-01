const mongoose = require('mongoose');
const { scoringQuestionSchema } = require('./scoringQuestion'); 
const { demographicsSchema } = require('./demographics');

const departmentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    city:{
      type: String,
      required: true
    },
    totalDepartmentScore:{
      type: Number,
      required: true
    },
    evaluationsCount:{
      type: Number,
      required: true
    },
    demographics: demographicsSchema,
    // averageScores:[scoringQuestionSchema]
    averageScores: [{
      question: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        required: true
      }
    }]
  });

  const Department = mongoose.model('Department', departmentSchema);

  module.exports = { Department, departmentSchema};