import { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface RequestBody {
  keywords: string;
  addNumber: boolean;
  addSpecialChar: boolean;
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
    const { keywords, addNumber, addSpecialChar }: RequestBody = req.body;

    if (!keywords || keywords.trim().length === 0) {
      return res.status(400).json({ error: 'Keywords are required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `Given the keyword: "${keywords.trim()}"

Generate 5 passphrases that:
- Are 5 to 8 words long
- Use natural, everyday English
- Words are lowercase and space-separated
- Do not include punctuation or quotation marks
- Are memorable and easy to type
- Include the keyword or related words when possible

Return only the 5 passphrases, one per line, without numbering or additional text.`;

    console.log('Sending request to Groq API...');
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    //   model: 'mixtral-8x7b-32768',
      model: 'mistral-saba-24b',
      temperature: 0.8,
      max_tokens: 500,
      top_p: 1,
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
      processed = processed.replace(/^\d+[.\)\-\s]+/, '');
      
      // Ensure first letter is capitalized and rest are lowercase
      processed = processed.charAt(0).toUpperCase() + processed.slice(1).toLowerCase();
      
      if (addNumber) {
        const randomNumber = Math.floor(Math.random() * 90) + 10; // 10-99
        processed += ` ${randomNumber}`;
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