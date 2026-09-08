const { GoogleGenAI } = require('@google/genai');

// @desc    Generate AI Campaign Content
// @route   POST /api/ai/generate
// @access  Private
exports.generateContent = async (req, res, next) => {
  try {
    const { prompt, template, type, targetSegments, targetTags, tone } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        error: 'AI generation is currently disabled. Please configure the GEMINI_API_KEY environment variable.',
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Construct the system prompt
    let systemPrompt = `You are an expert marketing copywriter. Your goal is to write high-converting, engaging content for a ${type} campaign.\n`;
    
    if (tone) systemPrompt += `Tone of Voice: ${tone}\n`;
    if (targetSegments && targetSegments.length > 0) {
      systemPrompt += `Target Audience Segments: ${targetSegments.join(', ')}\n`;
    }
    if (targetTags && targetTags.length > 0) {
      systemPrompt += `Audience Tags: ${targetTags.join(', ')}\n`;
    }

    systemPrompt += `\nTask: Based on the user's instructions below, write the campaign content. Do not include subject lines in the output, just the body content.`;

    const fullPrompt = `${systemPrompt}\n\nUser Instructions: ${prompt}\n\nPlease generate the content now.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    res.status(200).json({
      success: true,
      data: response.text,
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    next(error);
  }
};
