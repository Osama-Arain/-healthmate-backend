const AiInsight = require('../models/AiInsight');
const File = require('../models/File');
const { analyzeMedicalReport } = require('../utils/geminiHelper');

// Generate AI insight for a file
exports.generateInsight = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Find file
    const file = await File.findOne({
      _id: fileId,
      user: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if insight already exists
    const existingInsight = await AiInsight.findOne({ file: fileId });
    if (existingInsight) {
      return res.status(200).json({
        success: true,
        message: 'Insight already exists',
        data: existingInsight
      });
    }

    // Analyze with Gemini
    const analysis = await analyzeMedicalReport(file.fileUrl, file.fileType);

    if (!analysis.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to analyze report',
        error: analysis.error
      });
    }

    // Save insight
    const insight = await AiInsight.create({
      file: fileId,
      user: req.user.id,
      summary: {
        english: analysis.data.summaryEnglish,
        romanUrdu: analysis.data.summaryRomanUrdu
      },
      abnormalValues: analysis.data.abnormalValues,
      doctorQuestions: analysis.data.doctorQuestions,
      foodRecommendations: analysis.data.foodRecommendations,
      homeRemedies: analysis.data.homeRemedies
    });

    res.status(201).json({
      success: true,
      message: 'Insight generated successfully',
      data: insight
    });

  } catch (error) {
    console.error('Insight generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get insight for a file
exports.getInsight = async (req, res) => {
  try {
    const { fileId } = req.params;

    const insight = await AiInsight.findOne({
      file: fileId,
      user: req.user.id
    }).populate('file');

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }

    res.status(200).json({
      success: true,
      data: insight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all insights for user
exports.getAllInsights = async (req, res) => {
  try {
    const insights = await AiInsight.find({ user: req.user.id })
      .populate('file')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: insights.length,
      data: insights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};