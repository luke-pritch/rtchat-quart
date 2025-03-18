# Real-Time Chat Application

A modern real-time chat application built with Quart (Python backend) and Astro + React (frontend). This application demonstrates real-time communication using WebSockets and modern web development practices.

## Features

- Real-time messaging using WebSockets
- Modern UI with React components
- Static site generation with Astro
- Asynchronous backend with Quart
- Room-based chat system
- Username customization

## Prerequisites

- Node.js (v18 or higher)
- Python 3.11
- pipenv
- pnpm (v8 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/rtchat-quart.git
cd rtchat-quart
```

2. Install all dependencies:

```bash
pnpm run install:all
```

This will:

- Install root dependencies using pnpm
- Install frontend dependencies using pnpm
- Install backend Python dependencies using pipenv

## Development

To start the development servers:

```bash
pnpm run dev
```

This will start:

- Frontend server at http://localhost:3000
- Backend server at http://localhost:5001

## Building for Production

To build the frontend for production:

```bash
pnpm run build
```

## Project Structure

```
chat-app/
├── /frontend/              # Astro + React frontend
│   ├── /src/
│   │   ├── /components/   # React components
│   │   ├── /pages/        # Astro pages
│   │   └── /public/       # Static assets
│   ├── astro.config.mjs   # Astro configuration
│   └── package.json       # Frontend dependencies
├── /backend/              # Quart backend
│   ├── /app.py           # Main Quart application
│   └── /Pipfile         # Python dependencies
├── package.json          # Root-level scripts
└── README.md            # Project documentation
```

## Technologies Used

- **Backend**:

  - Quart (Python async web framework)
  - Hypercorn (ASGI server)
  - WebSockets for real-time communication

- **Frontend**:
  - Astro (Static site generation)
  - React (UI components)
  - TypeScript (Type safety)
  - WebSocket API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
