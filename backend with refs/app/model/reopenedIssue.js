const mongoose = require('mongoose');

const reOpenIssueSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
  });

  const ReOpenIssue = mongoose.model('ReOpenIssue', reOpenIssueSchema);

  module.exports = { ReOpenIssue, reOpenIssueSchema};