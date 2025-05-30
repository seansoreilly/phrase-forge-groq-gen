# Groq API Integration Setup

This application has been integrated with the Groq API to generate passphrases using AI.

## Setup Instructions

### 1. Get a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Environment Variables

#### For Local Development:

Create a `.env.local` file in the root directory:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new environment variable:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your Groq API key
   - **Environments**: Production, Preview, Development

### 3. Deploy or Run Locally

#### Local Development:

```bash
npm install
npm run dev
```

#### Deploy to Vercel:

```bash
vercel --prod
```

## How It Works

1. **Frontend**: React application with a clean UI for inputting keywords and options
2. **API Endpoint**: `/api/generate-passphrases` - Vercel serverless function that calls Groq API
3. **AI Model**: Uses Mixtral-8x7B-32768 model for generating creative passphrases
4. **Fallback**: If the API fails, the application falls back to mock passphrase generation

## API Usage

The API endpoint accepts POST requests with:

```json
{
  "keywords": "your keywords here",
  "addNumber": true,
  "addSpecialChar": false
}
```

Returns:

```json
{
  "passphrases": [
    "Purple mountain dreams cascade gently 42!",
    "Ancient forest whispers tell secrets",
    "Golden sunset paints memories forever",
    "Dancing lights illuminate pathways bright",
    "Peaceful garden moments create magic"
  ],
  "success": true
}
```

## Features

- ✅ Real Groq API integration
- ✅ Fallback to mock data if API unavailable
- ✅ Customizable passphrase options (numbers, special characters)
- ✅ CORS support for frontend integration
- ✅ Error handling and logging
- ✅ Responsive UI with copy-to-clipboard functionality

## Troubleshooting

1. **API Key Issues**: Make sure your GROQ_API_KEY is properly set in environment variables
2. **CORS Issues**: The API endpoint includes proper CORS headers
3. **Fallback Mode**: If you see mock passphrases, check the console for API errors
4. **Rate Limits**: Groq API has rate limits - the app will show errors if exceeded

## Cost Considerations

- Groq offers generous free tier usage
- Each passphrase generation uses approximately 100-500 tokens
- Monitor your usage in the Groq console

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- The API key is only used server-side in the Vercel function
