const { model } = require('../config/gemini');
const axios = require('axios');

// Medical report analyze karne ka function
exports.analyzeMedicalReport = async (fileUrl, fileType) => {
  try {
    // File download karo (buffer format mein)
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer'
    });
    
    const fileBuffer = Buffer.from(response.data);
    const base64Data = fileBuffer.toString('base64');

    // Determine MIME type
    let mimeType = 'image/jpeg';
    if (fileUrl.includes('.pdf')) {
      mimeType = 'application/pdf';
    } else if (fileUrl.includes('.png')) {
      mimeType = 'image/png';
    }

    // Gemini ko prompt bhejo
    const prompt = `
You are a medical report analyzer. Analyze this ${fileType} report and provide:

1. **Summary** (in English): A brief overview of the report
2. **Summary** (in Roman Urdu): Same summary in Roman Urdu (using English alphabets)
3. **Abnormal Values**: List any values outside normal range with severity
4. **Doctor Questions**: 3-5 important questions to ask the doctor
5. **Food Recommendations**: 
   - Foods to avoid
   - Foods recommended
6. **Home Remedies**: Simple, safe home remedies (if applicable)

Format your response as JSON with these exact keys:
{
  "summaryEnglish": "...",
  "summaryRomanUrdu": "...",
  "abnormalValues": [{"parameter": "...", "value": "...", "normalRange": "...", "severity": "low/high/critical"}],
  "doctorQuestions": ["...", "..."],
  "foodRecommendations": {
    "avoid": ["...", "..."],
    "recommended": ["...", "..."]
  },
  "homeRemedies": ["...", "..."]
}

Be professional, accurate, and empathetic in your response.
`;

    // Gemini ko file aur prompt bhejo
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      prompt
    ]);

    const responseText = result.response.text();
    
    // JSON parse karo
    // Remove markdown code blocks if present
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const analysis = JSON.parse(jsonText);

    return {
      success: true,
      data: analysis
    };

  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Simple text analysis (for vitals suggestions)
exports.analyzeVitals = async (vitalsData) => {
  try {
    const prompt = `
Analyze these health vitals and provide brief advice in both English and Roman Urdu:

${JSON.stringify(vitalsData, null, 2)}

Provide response as JSON:
{
  "adviceEnglish": "...",
  "adviceRomanUrdu": "..."
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const advice = JSON.parse(jsonText);

    return {
      success: true,
      data: advice
    };

  } catch (error) {
    console.error('Vitals Analysis Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};