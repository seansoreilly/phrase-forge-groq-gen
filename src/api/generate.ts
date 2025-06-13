interface RequestBody {
  keywords: string;
  addNumber: boolean;
  addSpecialChar: boolean;
  includeSpaces: boolean;
}

interface ApiResponse {
  passphrases: string[];
  success: boolean;
  error?: string;
  details?: string;
}

export async function generatePassphrases(requestBody: RequestBody): Promise<string[]> {
  const { keywords, addNumber, addSpecialChar, includeSpaces } = requestBody;

  if (!keywords || keywords.trim().length === 0) {
    throw new Error('Keywords are required');
  }

  console.log('Generating passphrases for keywords:', keywords);
  console.log('Options:', { addNumber, addSpecialChar, includeSpaces });

  try {
    const response = await fetch('/api/generate-passphrases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords: keywords.trim(),
        addNumber,
        addSpecialChar,
        includeSpaces,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.success || !data.passphrases) {
      throw new Error(data.error || 'Failed to generate passphrases');
    }

    return data.passphrases;
  } catch (error) {
    console.error('API Error:', error);
    
    // If there's an issue with the API, fall back to mock implementation
    console.log('Falling back to mock implementation...');
    const mockPassphrases = generateMockPassphrases(keywords, addNumber, addSpecialChar, includeSpaces);
    return mockPassphrases;
  }
}

function generateMockPassphrases(keywords: string, addNumber: boolean, addSpecialChar: boolean, includeSpaces: boolean): string[] {
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
    `singing ${keywordLower} birds welcome dawn`,
    `mysterious ${keywordLower} castle tower view`,
    `gentle ${keywordLower} rain on window glass`
  ];

  // Select 5 random templates
  const selectedTemplates = baseTemplates
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return selectedTemplates.map(template => {
    let passphrase = template.charAt(0).toUpperCase() + template.slice(1);
    
    // Remove spaces if includeSpaces is false
    if (!includeSpaces) {
      passphrase = passphrase.replace(/\s+/g, '');
    }
    
    if (addNumber) {
      const randomNumber = Math.floor(Math.random() * 90) + 10; // 10-99
      passphrase += includeSpaces ? ` ${randomNumber}` : randomNumber;
    }
    
    if (addSpecialChar) {
      const specialChars = ['!', '@', '#', '$', '%', '&', '*', '?'];
      const randomChar = specialChars[Math.floor(Math.random() * specialChars.length)];
      passphrase += randomChar;
    }
    
    return passphrase;
  });
}
