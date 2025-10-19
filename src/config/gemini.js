const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini initialize karo
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Working model: gemini-2.0-flash-exp
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp" // ✅ This one is working!
});

// Alternative models configuration
const MODEL_NAMES = {
  FLASH_2:    'gemini-2.0-flash-thinking-exp', // Primary (working)
  // Add more as you discover them
};

// Helper function for flexible model selection
const getModel = (modelType = 'flash') => {
  return genAI.getGenerativeModel({ 
    model: MODEL_NAMES.FLASH_2 
  });
};

module.exports = { 
  genAI, 
  model,
  getModel,
  MODEL_NAMES
};