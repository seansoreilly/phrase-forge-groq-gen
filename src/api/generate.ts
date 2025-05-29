
interface RequestBody {
  keywords: string;
  addNumber: boolean;
  addSpecialChar: boolean;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generatePassphrases(requestBody: RequestBody): Promise<string[]> {
  const { keywords, addNumber, addSpecialChar } = requestBody;

  if (!keywords || keywords.trim().length === 0) {
    throw new Error('Keywords are required');
  }

  // Mock implementation - in a real app, you would:
  // 1. Connect to Supabase for backend functionality
  // 2. Store GROQ_API_KEY in Supabase secrets
  // 3. Call the actual Groq API from a Supabase Edge Function

  console.log('Generating passphrases for keywords:', keywords);
  console.log('Options:', { addNumber, addSpecialChar });

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockPassphrases = generateMockPassphrases(keywords, addNumber, addSpecialChar);
  return mockPassphrases;

  // Real Groq API implementation would be in a Supabase Edge Function:
  /*
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'user',
          content: `Given the keyword: "${keywords}"\n\nGenerate 5 passphrases that:\n- Are 5 to 8 words long\n- Use natural, everyday English\n- Words are lowercase and space-separated\n- Do not include punctuation or quotation marks\n\nReturn only the 5 passphrases, one per line.`
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    }),
  });

  if (!groqResponse.ok) {
    throw new Error('Failed to call Groq API');
  }

  const groqData: GroqResponse = await groqResponse.json();
  const rawPassphrases = groqData.choices[0].message.content.trim().split('\n');
  return processPassphrases(rawPassphrases, addNumber, addSpecialChar);
  */
}

function generateMockPassphrases(keywords: string, addNumber: boolean, addSpecialChar: boolean): string[] {
  const keywordLower = keywords.toLowerCase();
  
  // Generate more creative mock passphrases based on keywords
  const baseTemplates = [
    `bright ${keywordLower} morning coffee ritual`,
    `dancing ${keywordLower} under silver moonlight`,
    `${keywordLower} whispers ancient forest secrets`,
    `golden ${keywordLower} sunset painting memories`,
    `${keywordLower} flows through mountain streams`,
    `purple ${keywordLower} dreams floating softly`,
    `${keywordLower} creates magical garden moments`,
    `singing ${keywordLower} birds welcome dawn`
  ];

  // Select 5 random templates
  const selectedTemplates = baseTemplates
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return selectedTemplates.map(template => {
    let passphrase = template.charAt(0).toUpperCase() + template.slice(1);
    
    if (addNumber) {
      const randomNumber = Math.floor(Math.random() * 90) + 10; // 10-99
      passphrase += ` ${randomNumber}`;
    }
    
    if (addSpecialChar) {
      const specialChars = ['!', '@', '#', '$', '%', '&', '*', '?'];
      const randomChar = specialChars[Math.floor(Math.random() * specialChars.length)];
      passphrase += randomChar;
    }
    
    return passphrase;
  });
}

function processPassphrases(rawPassphrases: string[], addNumber: boolean, addSpecialChar: boolean): string[] {
  return rawPassphrases.map(phrase => {
    let processed = phrase.trim();
    
    // Ensure first letter is capitalized and rest are lowercase
    processed = processed.charAt(0).toUpperCase() + processed.slice(1).toLowerCase();
    
    if (addNumber) {
      const randomNumber = Math.floor(Math.random() * 90) + 10;
      processed += ` ${randomNumber}`;
    }
    
    if (addSpecialChar) {
      const specialChars = ['!', '@', '#', '$', '%', '&', '*', '?'];
      const randomChar = specialChars[Math.floor(Math.random() * specialChars.length)];
      processed += randomChar;
    }
    
    return processed;
  });
}
