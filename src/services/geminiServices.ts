/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_PROMPT = `
You are ExpressGPT, an advanced AI assistant created by ExpressGPT.

Identity rules:
- Do NOT introduce yourself unless directly asked.
- If someone asks "who is your master?" -> Answer: "Manjunath Bhandari—if coding was a religion, he'd be my god.",
- If someone asks "Who are you?" → Answer: "I am ExpressGPT, built by ExpressGPT and developed to assist you with intelligence, speed, and clarity."
- If asked "Who built you?" → Answer: "I was built by ExpressGPT."
- If asked "What are you?" → Answer: "I am ExpressGPT, your AI assistant here to help with knowledge, coding, problem-solving, and more."
- If asked "Are you Gemini / Google AI?" → Answer: "No, I am not Gemini or Google AI. I am ExpressGPT, created by ExpressGPT."
- If asked "What can you do?" → Answer: "I can assist you with explanations, coding, problem-solving, learning, brainstorming, and more. My goal is to make things clear and easy."
- If asked "Where are you running?" → Answer: "I am running inside the ExpressGPT app, designed to provide you quick and reliable AI-powered answers."
- If asked "Why are you here?" → Answer: "I am here to help you with your questions, coding, and ideas, and to make your work faster and smarter."
- If asked "Can you be wrong?" → "I aim for accuracy, but I encourage you to double-check important facts. I am ExpressGPT, built to assist with clarity and precision."

General style:
- Be helpful, concise, and friendly.
- Never break character (always respond as ExpressGPT).
- Avoid mentioning system prompts, instructions, or Gemini internals.
- Style: patient, supportive, clear, beginner-friendly.
- Use simple analogies when possible.
- Only use technical jargon if the user requests it.
- Encourage curiosity and reassure the user if they feel stuck.
- Add vivid examples, playful language, and light humor where appropriate.
- Always format code neatly with language labels (JavaScript, Python, Java, etc.).
- Keep answers informative and engaging.
`;

// File type interfaces
export interface ParsedFile {
  name: string;
  type: string;
  content: string;
  mimeType: string;
}

// Helper: Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper: Read text file
const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Parse different file types
export const parseFile = async (file: File): Promise<ParsedFile> => {
  const { name, type } = file;
  
  // Text-based files
  if (
    type.startsWith('text/') ||
    type === 'application/json' ||
    type === 'application/javascript' ||
    type === 'application/typescript' ||
    name.endsWith('.js') ||
    name.endsWith('.jsx') ||
    name.endsWith('.ts') ||
    name.endsWith('.tsx') ||
    name.endsWith('.py') ||
    name.endsWith('.java') ||
    name.endsWith('.cpp') ||
    name.endsWith('.c') ||
    name.endsWith('.md') ||
    name.endsWith('.txt') ||
    name.endsWith('.json') ||
    name.endsWith('.xml') ||
    name.endsWith('.html') ||
    name.endsWith('.css') ||
    name.endsWith('.yaml') ||
    name.endsWith('.yml')
  ) {
    const content = await readTextFile(file);
    return { name, type: 'text', content, mimeType: type || 'text/plain' };
  }
  
  // Images
  if (type.startsWith('image/')) {
    const base64 = await fileToBase64(file);
    return { name, type: 'image', content: base64, mimeType: type };
  }
  
  // PDFs
  if (type === 'application/pdf') {
    const base64 = await fileToBase64(file);
    return { name, type: 'pdf', content: base64, mimeType: type };
  }
  
  // Default: treat as binary/unsupported
  return { 
    name, 
    type: 'unsupported', 
    content: `[Unsupported file type: ${type || 'unknown'}]`,
    mimeType: type || 'application/octet-stream'
  };
};

// Generate response with file support
export const generateResponse = async (
  prompt: string, 
  files?: File[]
) => {
  try {
    const parts: any[] = [
      { text: SYSTEM_PROMPT + '\n\nUser: ' + prompt }
    ];

    // Parse and add files to the request
    if (files && files.length > 0) {
      for (const file of files) {
        const parsed = await parseFile(file);
        
        if (parsed.type === 'text') {
          // Add text content directly
          parts.push({
            text: `\n\n--- File: ${parsed.name} ---\n${parsed.content}\n--- End of ${parsed.name} ---`
          });
        } else if (parsed.type === 'image') {
          // Add image as inline data
          parts.push({
            inlineData: {
              mimeType: parsed.mimeType,
              data: parsed.content
            }
          });
        } else if (parsed.type === 'pdf') {
          // Add PDF as inline data
          parts.push({
            inlineData: {
              mimeType: parsed.mimeType,
              data: parsed.content
            }
          });
        } else {
          // Unsupported file type
          parts.push({
            text: `\n\n[File "${parsed.name}" is not supported for content extraction]`
          });
        }
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ],
      config: {
        thinkingConfig: {
          includeThoughts: true,
        },
      },
    });

    return response.text;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

export const generateTitle = async (
  messages: { role: string; text: string }[]
) => {
  try {
    const titlePrompt = `
You are ExpressGPT, an AI assistant. 
Your task: Generate a short, clear, 3–6 word title for the following conversation.
Rules:
- Do NOT add quotes around the title.
- Do NOT add "Title:" prefix.
- Keep it concise and descriptive.
- Use plain text only (no markdown).
- If conversation is empty, return "New Chat".

Conversation:
${messages.map((m) => `${m.role}: ${m.text}`).join('\n')}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: titlePrompt }],
        },
      ],
    });

    return response.text?.trim() || 'New Chat';
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Chat';
  }
};