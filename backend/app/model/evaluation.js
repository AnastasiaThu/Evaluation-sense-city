    const mongoose = require('mongoose');
    const { scoringQuestionSchema } = require('./scoringQuestion'); 
    const {textQuestionSchema} = require('./textQuestion');
    const {departmentSchema} = require('./department');

    // Schema for the overall evaluation
    const evaluationSchema = new mongoose.Schema({
        scoringQuestions: [scoringQuestionSchema], 
        textQuestions: [textQuestionSchema],
        department: departmentSchema,
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
