const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  summary: {
    english: {
      type: String,
      required: true
    },
    romanUrdu: {
      type: String,
      required: true
    }
  },
  abnormalValues: [{
    parameter: String,
    value: String,
    normalRange: String,
    severity: {
      type: String,
      enum: ['low', 'high', 'critical']
    }
  }],
  doctorQuestions: [{
    type: String
  }],
  foodRecommendations: {
    avoid: [String],
    recommended: [String]
  },
  homeRemedies: [String],
  disclaimer: {
    type: String,
    default: 'This is AI-generated information for understanding purposes only. Always consult your doctor before making any medical decisions. / Yeh AI se bani information sirf samajhne ke liye hai. Koi bhi medical decision lene se pehle apne doctor se zaroor consult karein.'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AiInsight', aiInsightSchema);