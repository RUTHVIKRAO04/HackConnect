# HackConnect - Hackathon Management Platform

# HackConnect

HackConnect is a web application that facilitates collaboration among hackathon participants by enabling team formation, idea sharing, and real-time communication. The platform fosters efficient project development and team synergy.

# Features

- **User Authentication**: Secure registration and login system powered by Firebase.
- **Team Collaboration**: Allows participants to form teams, share ideas, and work collaboratively.
- **Chat System**: Real-time chat interface using the @chatscope/chat-ui-kit-react library.
- **Navigation**: Smooth navigation across Home, Team, Chat, About, and Login pages.

# Technology Stack

- **Frontend**: TypeScript, React, Tailwind CSS.
- **Backend**: Node.js, Express.
- **Authentication**: Firebase for secure user management.
- **Development Tools**: Vite for fast frontend development and ts-node for server-side TypeScript execution.

# How It Works

1. **User Registration and Login**: Users can securely register and log in to access the platform.
2. **Team Formation**: Users can create or join teams, facilitating idea sharing and collaboration.
3. **Real-time Chat**: Participants can communicate with their teams using an integrated chat system.
4. **Navigation**: An intuitive interface with seamless transitions between core features.

# Project Structure

```
├── index.html          # Main landing page
├── src/                # Source code directory
│   ├── main.tsx       # React entry point
│   ├── components/    # Reusable React components
│   ├── pages/         # Application pages (Home, Team, Chat)
│   └── services/      # Firebase and API integrations
├── server/            # Backend services (Express)
│   └── index.ts      # Main server entry point
├── package.json       # Project metadata and scripts
├── tsconfig.app.json  # TypeScript configuration for frontend
├── tsconfig.server.json # TypeScript configuration for backend
└── tailwind.config.js # Tailwind CSS configuration
```

