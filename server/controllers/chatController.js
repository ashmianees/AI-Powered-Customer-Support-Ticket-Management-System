import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/Chat.js';

const getModelCandidates = () => {
  const configuredModels = (process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const fallbackModels = (process.env.GEMINI_MODEL_FALLBACKS || 'gemini-2.0-flash,gemini-1.5-flash')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set([...configuredModels, ...fallbackModels])];
};

const getAIResponse = async (userMessage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "Thank you for reaching out to AI Customer Support. (Note: GEMINI_API_KEY is not set in server/.env). How can I assist you with your ticket today?";
  }

  const candidateModels = getModelCandidates();
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: "You are an intelligent, empathetic, and highly helpful AI Customer Support Assistant. Your goal is to assist customers with troubleshooting, account queries, billing issues, and general support. Provide concise, step-by-step guidance. If an issue requires manual staff intervention, advise the user to submit a support ticket in the portal."
      });

      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();
      if (text) return text;
    } catch (error) {
      const errorMessage = error?.message || 'Unknown Gemini API error';
      console.warn(`[Gemini AI] Model ${modelName} failed: ${errorMessage}. Trying next model...`);
      lastError = error;
    }
  }

  const fallbackMessage = 'The AI assistant is currently unavailable due to Gemini service limits or an unsupported model. Please try again shortly or submit a support ticket.';
  console.error('[Gemini AI Error]:', lastError?.message || 'No model succeeded');
  return `AI Assistant encountered an issue processing your request. ${fallbackMessage}`;
};

// @desc    Send message to Gemini AI and save to DB
// @route   POST /api/chat
export const handleChatMessage = async (req, res, next) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage || !userMessage.trim()) {
      res.status(400);
      throw new Error('Message content cannot be empty');
    }

    const userId = req.user._id;

    // Get previous chat history for context
    const previousChats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const historyContext = previousChats.reverse().map(c => `User: ${c.userMessage}\nAI: ${c.aiResponse}`).join('\n');
    const fullPrompt = historyContext ? `${historyContext}\nUser: ${userMessage}` : userMessage;

    const aiResponseText = await getAIResponse(fullPrompt);

    // Save to Database
    const chatDoc = await Chat.create({
      userId,
      userMessage: userMessage.trim(),
      aiResponse: aiResponseText
    });

    res.status(200).json({
      success: true,
      chat: chatDoc
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Chat History
// @route   GET /api/chat/history
export const getChatHistory = async (req, res, next) => {
  try {
    const history = await Chat.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear Chat History
// @route   DELETE /api/chat/history
export const clearChatHistory = async (req, res, next) => {
  try {
    await Chat.updateMany({ userId: req.user._id }, { deletedAt: new Date() });
    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};
