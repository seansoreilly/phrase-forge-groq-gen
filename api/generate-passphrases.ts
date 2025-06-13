import { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface RequestBody {
  keywords: string;
  addNumber: boolean;
  addSpecialChar: boolean;
  includeSpaces: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keywords, addNumber, addSpecialChar, includeSpaces }: RequestBody = req.body;

    if (!keywords || keywords.trim().length === 0) {
      return res.status(400).json({ error: 'Keywords are required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Generate 5 unique short phrases (MINIMUM 4 words, maximum 10 words each) from the artist "${keywords.trim()}".

    Requirements:
    - Use ACTUAL CONSECUTIVE WORDS from published song titles
    - Do NOT invent or modify titles
    - Do NOT change the order of words
    - Do NOT provide duplicates
    - Each phrase must be exactly as it appears in the original public song titles
    
    RESPONSE FORMAT: Return ONLY the phrases, one per line, with NO explanatory text, NO introductions, NO headers.
      
    If you're not certain about exact lyrics, don't guess.`;
    
    // Even more conservative settings
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant', // Larger model for better factual accuracy
      temperature: 0.1, // Very low for maximum accuracy
      max_tokens: 200,
      top_p: 0.9,
      stream: false,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response content from Groq API');
    }

    console.log('Raw Groq response:', responseContent);

    // Parse the response to extract passphrases
    const rawPassphrases = responseContent
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter((phrase, index, self) => self.indexOf(phrase) === index)
      .slice(0, 5); // Ensure we only take 5 passphrases

    if (rawPassphrases.length === 0) {
      throw new Error('Failed to extract passphrases from Groq response');
    }

    // Process passphrases with optional number and special character
    const processedPassphrases = rawPassphrases.map(phrase => {
      let processed = phrase.trim();
      
      // Remove any quotation marks
      processed = processed.replace(/["""'']/g, '');
      
      // Remove any numbering (e.g., "1. " or "1) ")
      processed = processed.replace(/^\d+[.)\-\s]+/, '');
      
      // Ensure first letter is capitalized and rest are lowercase
      processed = processed.charAt(0).toUpperCase() + processed.slice(1).toLowerCase();
      
      // Remove spaces if includeSpaces is false
      if (!includeSpaces) {
        processed = processed.replace(/\s+/g, '');
      }
      
      if (addNumber) {
        const randomNumber = Math.floor(Math.random() * 90) + 10; // 10-99
        processed += includeSpaces ? ` ${randomNumber}` : randomNumber;
      }
      
      if (addSpecialChar) {
        const specialChars = ['!', '@', '#', '$', '%', '&', '*', '?'];
        const randomChar = specialChars[Math.floor(Math.random() * specialChars.length)];
        processed += randomChar;
      }
      
      return processed;
    });

    console.log('Processed passphrases:', processedPassphrases);

    return res.status(200).json({ 
      passphrases: processedPassphrases,
      success: true 
    });

  } catch (error) {
    console.error('Error generating passphrases:', error);
    
    // Check if it's a Groq API error
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Failed to generate passphrases',
        details: error.message,
        success: false
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false
    });
  }
} 