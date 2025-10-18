const Vitals = require('../models/Vitals');
const { analyzeVitals } = require('../utils/geminiHelper');

// Add vitals
exports.addVitals = async (req, res) => {
  try {
    const vitalsData = {
      user: req.user.id,
      ...req.body
    };

    const vitals = await Vitals.create(vitalsData);

    res.status(201).json({
      success: true,
      message: 'Vitals added successfully',
      data: vitals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all vitals for user
exports.getVitals = async (req, res) => {
  try {
    const vitals = await Vitals.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: vitals.length,
      data: vitals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single vital
exports.getVital = async (req, res) => {
  try {
    const vital = await Vitals.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update vitals
exports.updateVitals = async (req, res) => {
  try {
    const vital = await Vitals.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vitals updated successfully',
      data: vital
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete vitals
exports.deleteVitals = async (req, res) => {
  try {
    const vital = await Vitals.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vitals deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get AI advice for vitals
exports.getVitalsAdvice = async (req, res) => {
  try {
    const vital = await Vitals.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record notRetryClaude does not have the ability to run the code it generates yet.OContinuefound'
});
}
// Analyze vitals with Gemini
const analysis = await analyzeVitals(vital);

if (!analysis.success) {
  return res.status(500).json({
    success: false,
    message: 'Failed to analyze vitals',
    error: analysis.error
  });
}

res.status(200).json({
  success: true,
  data: analysis.data
});
}
 catch (error) {
res.status(500).json({
success: false,
message: error.message
});
}
};