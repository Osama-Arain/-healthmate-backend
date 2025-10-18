const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  bloodSugar: {
    value: Number,
    unit: {
      type: String,
      enum: ['mg/dL', 'mmol/L'],
      default: 'mg/dL'
    },
    testType: {
      type: String,
      enum: ['fasting', 'random', 'post_meal'],
      default: 'random'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  height: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  temperature: {
    value: Number,
    unit: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      default: 'celsius'
    }
  },
  heartRate: {
    type: Number
  },
  oxygenLevel: {
    type: Number
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vitals', vitalsSchema);