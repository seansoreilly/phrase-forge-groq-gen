# Phrase Forge - Groq Passphrase Generator

## 📋 Project Overview

**Phrase Forge** is a modern web application built to generate secure, memorable passphrases using AI technology. This project leverages the Groq API to create human-readable passphrases based on user-provided keywords.

### 🎯 Core Functionality

- **Keyword-based Generation**: Users input keywords to generate contextually relevant passphrases.
- **Customization Options**:
  - Toggle to add numbers to passphrases.
  - Toggle to add special characters.
- **Multiple Outputs**: Generates 5 passphrases per request.
- **Copy to Clipboard**: One-click copying of generated passphrases.
- **Responsive UI**: Modern, mobile-friendly interface.

## 🏗️ Technical Architecture

### Frontend Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 3.4.11
- **Routing**: React Router DOM 6.26.2
- **State Management**: React Hook Form + Zod validation
- **HTTP Client**: TanStack React Query 5.56.2
- **AI Integration**: Groq SDK

## 📁 Project Structure

```
phrase-forge-groq-gen/
├── src/
│   ├── api/                 # API integration layer (Vercel serverless functions)
│   │   └── generate-passphrases.ts # Passphrase generation logic using Groq API
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/
│   │   ├── Index.tsx        # Main application page
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── doc/                     # Project documentation
├── .vercel/                 # Vercel deployment configuration and cache
└── logs/                    # Application logs (if any)
```

## 🚀 Getting Started

### Prerequisites

- Node.js & npm (or yarn/pnpm)
- A Groq API Key

### Groq API Key Setup

1.  **Get a Groq API Key**:

    - Go to [console.groq.com](https://console.groq.com)
    - Sign up or log in.
    - Navigate to the API Keys section.
    - Create a new API key and copy it.

2.  **Configure Environment Variables**:

    - **For Local Development**:
      Create a `.env` file (or `.env.local`) in the project root:

      ```env
      VITE_GROQ_API_KEY=your_groq_api_key_here
      ```

      _Note: Vite requires environment variables accessible to the client to be prefixed with `VITE_`.\_

    - **For Vercel Deployment**:

      1.  Go to your Vercel project dashboard.
      2.  Navigate to Settings → Environment Variables.
      3.  Add a new environment variable:
          - **Name**: `VITE_GROQ_API_KEY` (or `GROQ_API_KEY` if used server-side only, see note below)
          - **Value**: Your Groq API key
          - **Environments**: Production, Preview, Development

      _Important_: If the Groq API key is only used in a serverless function (e.g., in the `api/` directory for Vercel), you might name the environment variable `GROQ_API_KEY` directly without the `VITE_` prefix for Vercel environment variables. However, if any client-side code needs to be aware of or use this key (even indirectly), the `VITE_` prefix is necessary for local development with Vite. The `GROQ_SETUP.md` suggests the serverless function is `/api/generate-passphrases.ts`, so for Vercel, `GROQ_API_KEY` would be appropriate if the function reads it from `process.env`. For local Vite dev server, if the call is proxied or made directly from frontend, `VITE_GROQ_API_KEY` would be used and accessed via `import.meta.env.VITE_GROQ_API_KEY`. The current structure implies a Vercel serverless function.

### Development Setup

1.  **Clone the repository**:

    ```bash
    git clone <YOUR_GIT_REPOSITORY_URL>
    cd phrase-forge-groq-gen
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

### Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run build:dev`: Builds the application in development mode.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## 🔧 Current Implementation Status

### ✅ Completed Features

- Modern React application with TypeScript.
- Comprehensive UI component library from shadcn/ui.
- Responsive design implemented with Tailwind CSS.
- Form handling and validation using React Hook Form and Zod.
- Toast notifications for user feedback.
- Copy-to-clipboard functionality for generated passphrases.
- Vercel deployment configuration.
- Integration with Groq API for passphrase generation (via Vercel serverless function).
- Fallback to mock passphrase generation if the Groq API call fails or is not configured.

### 🚧 API Integration Details

- **API Endpoint**: A Vercel serverless function, likely located at `api/generate-passphrases.ts`, handles requests to the Groq API.
- **AI Model**: The application is configured to use a model like Mixtral-8x7B-32768 for generating passphrases.
- **Fallback Mechanism**: If the Groq API is unavailable or an error occurs, the system may provide mock/placeholder passphrases.

The API endpoint `api/generate-passphrases.ts` typically accepts POST requests with a JSON body like:

```json
{
  "keywords": "your keywords here",
  "addNumber": true,
  "addSpecialChar": false
}
```

And returns:

```json
{
  "passphrases": [
    "Passphrase one...",
    "Passphrase two..."
    // ... up to 5 passphrases
  ],
  "success": true // or false in case of an error
}
```

## 🚀 Deployment

This project is configured for deployment on Vercel.

1.  Ensure your Groq API key is set as an environment variable in your Vercel project settings (e.g., `GROQ_API_KEY`).
2.  Connect your Git repository to Vercel.
3.  Vercel will automatically build and deploy the project upon pushes to the main branch (or as configured).
    - **Build Command**: `npm run build` (or `vite build`)
    - **Output Directory**: `dist`
    - **Framework Preset**: Vite

## 🔮 Future Development

### Planned Integrations & Enhancements

1.  **Supabase Backend**: Potential for user accounts, saving passphrase history, and more.
2.  **Advanced Passphrase Options**: More granular control over passphrase length, complexity settings (e.g., number of words, specific character sets).
3.  **Export Features**: Allow users to save generated passphrases to various formats (e.g., TXT, CSV).
4.  **Passphrase Strength Indicator**: Visual feedback on the strength of generated passphrases.
5.  **Enhanced Error Handling**: More specific user feedback for different API or generation errors.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

(Consider adding guidelines for commit messages, code style, etc., if applicable.)

## 📄 License

This project is likely under a standard open-source license (e.g., MIT). Please add a `LICENSE` file to the repository.

---

_This README was generated based on project documentation and codebase analysis._
