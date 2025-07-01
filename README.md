# 🤖 AI Chatbot Platform

This is a sophisticated AI chatbot platform built with Next.js, OpenAI, and Supabase. It allows users to create, manage, and interact with personalized AI assistants in real-time.

![Chatbot UI Screenshot](https://user-images.githubusercontent.com/12345/placeholder.png) <!-- Replace with an actual screenshot -->

---

## ✨ Features

- **Create & Manage Assistants**: Easily create and configure AI assistants with unique instructions and settings.
- **Real-time Chat Interface**: A smooth, responsive chat interface for interacting with your AI assistants.
- **OpenAI Integration**: Leverages the power of OpenAI's models for intelligent and context-aware conversations.
- **Supabase Backend**: Utilizes Supabase for database storage, and user authentication.
- **Next.js 15 App Router**: Built with the latest Next.js features for optimal performance and developer experience.
- **TypeScript**: Fully typed codebase for better maintainability and fewer runtime errors.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [OpenAI API](https://openai.com/docs)
- **Backend & DB**: [Supabase](https://supabase.io/)
- **UI**: [React](https://react.dev/)

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [Yarn](https://yarnpkg.com/) or npm/pnpm

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following variables. You can get these from your Supabase and OpenAI dashboards.

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # OpenAI
    OPENAI_API_KEY=your_openai_api_key
    ```

4.  **Run the development server:**

    ```bash
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📁 Project Structure

The project follows a feature-based structure using the Next.js App Router.

```
/src
├── app
│   ├── (default)       # Routes with the default layout
│   │   └── assistants
│   ├── (navbar)        # Routes with the main navbar/sidebar layout
│   │   └── chat
│   └── api             # API routes for backend logic
│       ├── assistants
│       └── chats
├── components          # Reusable React components
│   ├── assistants
│   ├── chat
│   ├── navbar
│   └── ui
├── contexts            # React Context for global state
├── lib                 # Library functions (OpenAI, Supabase clients)
└── types               # TypeScript type definitions
```

### Workflow Overview

1.  **User Authentication**: Handled by Supabase Auth.
2.  **Assistants**: Users can create assistants via the UI. The data is sent to `/api/assistants` and stored in the Supabase database.
3.  **Chat**: When a user sends a message, it goes to the `/api/chats/[id]/messages` endpoint.
4.  **AI Response**: The API route communicates with the OpenAI API to get a response from the selected assistant.
5.  **Real-time Updates**: The chat interface is updated in real-time with new messages.

---

## ☁️ Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Make sure to set the environment variables in your Vercel project settings.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
