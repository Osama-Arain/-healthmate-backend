const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  try {
    console.log('🔍 Testing available models...\n');

    // Comprehensive list of possible model names
    const modelsToTest = [
      // Gemini 2.0 models
      'gemini-2.0-flash-exp',
      'gemini-2.0-flash-thinking-exp',
      
     
      
    ];

    const workingModels = [];

    for (const modelName of modelsToTest) {
      try {
        console.log(`Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        console.log(`✅ ${modelName} - WORKING!`);
        console.log(`   Response: ${response.text()}\n`);
        workingModels.push(modelName);
      } catch (error) {
        console.log(`❌ ${modelName} - NOT AVAILABLE\n`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`\n✅ Working Models (${workingModels.length}):`);
    workingModels.forEach(model => console.log(`   • ${model}`));
    
    if (workingModels.length > 0) {
      console.log(`\n🎯 Recommended model for your project: ${workingModels[0]}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testModels();   