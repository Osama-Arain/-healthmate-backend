const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['blood_test', 'xray', 'ultrasound', 'prescription', 'mri', 'ct_scan', 'other'],
    default: 'other'
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('File', fileSchema);