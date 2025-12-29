# Inkjet

A beautiful AI-powered document editor that helps you write with your knowledge. Add reference materials, let AI assist your writing, and craft documents that draw from everything you know.

## Features

- **Knowledge Library** - Add reference materials, notes, and sources. Your AI assistant uses them to inform every suggestion.
- **AI Writing Partner** - An intelligent assistant that understands context. Get help writing, editing, and refining your prose.
- **Beautiful Editor** - A distraction-free writing environment with rich formatting. Focus on your words, not the interface.
- **Auto-save** - Your documents are automatically saved as you type.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Convex (database, authentication, serverless functions)
- **Editor**: TipTap (rich text editor)
- **AI**: OpenAI GPT-4
- **Styling**: CSS Modules with custom design system

## Getting Started

### Prerequisites

- Node.js 18+
- A Convex account (free at [convex.dev](https://convex.dev))
- An OpenAI API key

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up Convex (this will prompt you to log in and create a project):

```bash
npx convex dev
```

3. Configure environment variables:

   Copy `.env.local.example` to `.env.local` and add your Convex URL (this is automatically set by `convex dev`)

4. Set your OpenAI API key in the Convex dashboard:

   - Go to your Convex project dashboard at [dashboard.convex.dev](https://dashboard.convex.dev)
   - Navigate to Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
inkjet/
├── convex/                 # Convex backend
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication setup
│   ├── documents.ts       # Document CRUD operations
│   ├── knowledge.ts       # Knowledge base operations
│   ├── ai.ts              # AI chat action
│   └── http.ts            # HTTP router for auth
├── src/
│   ├── pages/             # Page components
│   │   ├── LandingPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── EditorPage.tsx
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
└── package.json
```

## Usage

1. **Sign up / Log in** - Create an account or sign in to access your documents
2. **Create a Document** - Click "New Document" to start writing
3. **Add Knowledge** - Use the left sidebar to add reference materials
4. **Write with AI** - Use the right sidebar AI chat to get writing assistance
5. **Format Your Text** - Use the toolbar to format your document

## Design Philosophy

Inkjet is designed with a clean, minimal aesthetic using serif fonts for a classic and traditional look. The design features:

- Cormorant Garamond for display text
- Crimson Pro for body text
- Source Serif 4 for the editor
- Soft shadows and warm gradients
- A sophisticated color palette with warm browns and creams

## License

MIT
