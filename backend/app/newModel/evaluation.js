const mongoose = require('mongoose');
const { scoringQuestionSchema } = require('./scoringQuestion'); 
const {textQuestionSchema} = require('./textQuestion');
const {departmentSchema} = require('./department');
const { questionSchema } = require('./question');


// Schema for the overall evaluation
const evaluationSchema = new mongoose.Schema({
    scoringQuestions: [{
        question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
        },
        score: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
        }
    }], 
    textQuestions: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
          },
          answer: {
            type: String,
          }

    }],
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    status:{
        type: String,
        //new probably not needed 
        enum: ['new','draft', 'completed'],
        default: 'draft',
        required: true
    },
    requestID:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = { Evaluation };

