const mongoose = require('mongoose');
const { departmentSchema } = require('./department');
const { demographicsSchema } = require('./demographics');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      }, 
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
      }
    ],
    cityScore:{
        type: Number,
        required:true
    },
    evaluationsCount:{
        type: Number,
        required: true
      },
    demographics: demographicsSchema,
});

const City = mongoose.model('City', citySchema);

module.exports = { City };
