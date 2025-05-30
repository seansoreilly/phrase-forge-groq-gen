# Phrase Forge - Groq Passphrase Generator

## 📋 Project Overview

**Phrase Forge** is a modern web application built to generate secure, memorable passphrases using AI technology. The project leverages the Groq API (currently with mock implementation) to create human-readable passphrases based on user-provided keywords.

### 🎯 Core Functionality

- **Keyword-based Generation**: Users input keywords to generate contextually relevant passphrases
- **Customization Options**:
  - Toggle to add numbers to passphrases
  - Toggle to add special characters
- **Multiple Outputs**: Generates 5 passphrases per request
- **Copy to Clipboard**: One-click copying of generated passphrases
- **Responsive UI**: Modern, mobile-friendly interface

## 🏗️ Technical Architecture

### Frontend Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS 3.4.11
- **Routing**: React Router DOM 6.26.2
- **State Management**: React Hook Form + Zod validation
- **HTTP Client**: TanStack React Query 5.56.2

### Key Dependencies

```json
{
  "ui-framework": "shadcn/ui + Radix UI",
  "styling": "Tailwind CSS",
  "icons": "Lucide React",
  "forms": "React Hook Form + Zod",
  "notifications": "Sonner + Custom Toast",
  "themes": "Next Themes",
  "charts": "Recharts",
  "backend": "Supabase (configured)"
}
```

## 📁 Project Structure

```
phrase-forge-groq-gen/
├── src/
│   ├── api/                 # API integration layer
│   │   └── generate.ts      # Passphrase generation logic
│   ├── components/
│   │   └── ui/              # shadcn/ui components (50+ components)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── pages/
│   │   ├── Index.tsx        # Main application page
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── doc/                     # Documentation
├── .vercel/                 # Vercel deployment cache
└── logs/                    # Application logs
```

## 🔧 Current Implementation Status

### ✅ Completed Features

- Modern React application with TypeScript
- Complete UI component library (shadcn/ui)
- Responsive design with Tailwind CSS
- Form handling with validation
- Toast notifications
- Copy-to-clipboard functionality
- Mock passphrase generation
- Vercel deployment configuration

### 🚧 Development Status

- **API Integration**: Currently using mock implementation
- **Backend**: Configured for Supabase but not fully integrated
- **Groq API**: Prepared for integration but using placeholder logic

### 📝 Mock Implementation Notes

The current implementation includes a mock passphrase generator in `src/api/generate.ts` that:

- Simulates API delays (1.5s)
- Generates placeholder passphrases
- Includes comments showing planned Groq API integration
- Handles error states and loading states

## 🚀 Deployment & Development

### Development Setup

```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Deployment

- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Framework**: Vite (React)
- **Domain**: Configurable via Lovable platform

## 🛠️ Technologies & Tools

### Core Technologies

- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### UI/UX Libraries

- **shadcn/ui** - High-quality component library
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Performant forms library

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Lovable Tagger** - Development tagging system

## 🎨 User Interface

### Design System

- **Color Scheme**: Purple gradient backgrounds with white cards
- **Typography**: Clean, modern fonts with good contrast
- **Components**: Consistent shadcn/ui design language
- **Interactions**: Smooth hover effects and transitions
- **Accessibility**: Built on Radix UI for screen reader support

### Key UI Features

- Gradient backgrounds for visual appeal
- Card-based layout for content organization
- Toggle switches for user preferences
- Loading states with spinners
- Success/error toast notifications
- Responsive grid layouts

## 🔮 Future Development

### Planned Integrations

1. **Groq API Integration**: Replace mock with actual API calls
2. **Supabase Backend**: User accounts, passphrase history
3. **Advanced Options**: Passphrase length, complexity settings
4. **Export Features**: Save passphrases to various formats
5. **Passphrase Strength**: Visual strength indicators

### Potential Enhancements

- User authentication and profiles
- Passphrase history and favorites
- Bulk generation capabilities
- API rate limiting and usage tracking
- Advanced customization options

## 📚 Development Notes

This project was created using the Lovable platform and follows modern React development practices. The codebase is well-structured with clear separation of concerns, comprehensive UI components, and a foundation ready for backend integration.

**Project ID**: 3df81076-619b-42e6-a2ea-52da049f61c9
**Platform**: [Lovable.dev](https://lovable.dev)
**Repository**: Built for Git-based collaboration and deployment
