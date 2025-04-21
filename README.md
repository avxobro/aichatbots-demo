# AI Chat Assistant - Text & Voice

A dual-interface AI chat assistant built with Next.js that features both text-based and voice-based interaction capabilities.

## Features

### Text Chat (Left Panel)
- Text-based conversation with an AI assistant
- Real-time responses from OpenRouter API
- Clean, message-bubble interface
- Loading states and error handling

### Voice Chat (Right Panel)
- Voice input via microphone
- Speech-to-text using Deepgram API
- Text-to-speech for AI responses using Web Speech API
- Visual transcript display
- Recording status indicators

### Technical Features
- Responsive design (mobile and desktop optimized)
- Tab navigation on mobile devices
- Split-screen layout on desktop
- TypeScript for type safety
- Modern React patterns and hooks
- Tailwind CSS for styling

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **AI Integration**: OpenRouter API (Meta Llama 3 Maverick model)
- **Speech-to-Text**: Deepgram API
- **Text-to-Speech**: Web Speech API (browser native)
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn
- OpenRouter API key
- Deepgram API key

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
OPENROUTER_API_KEY=your_openrouter_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aichatbot.git
cd aichatbot
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
aichatbot/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts       # OpenRouter API integration
│   │   │   └── transcribe/
│   │   │       └── route.ts       # Deepgram API integration
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page with split layout
│   ├── components/
│   │   ├── TextChat.tsx           # Text chat component
│   │   ├── VoiceChat.tsx          # Voice chat component
│   │   └── TabToggle.tsx          # Mobile tab navigation
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   └── utils/
│       └── speech.ts              # Web Speech API utilities
├── .env.local                     # Environment variables
├── package.json
└── README.md
```

## How It Works

### Text Chat Flow

1. User types a message in the input field
2. Message is sent to the OpenRouter API via the `/api/chat` endpoint
3. AI response is displayed in the chat interface

### Voice Chat Flow

1. User clicks the "Start Recording" button
2. Browser requests microphone access
3. User speaks into the microphone
4. When recording is stopped, audio is sent to Deepgram API for transcription
5. Transcribed text is displayed and sent to OpenRouter API
6. AI response is displayed in the chat interface and spoken aloud using Web Speech API

## API Integrations

### OpenRouter API

The application uses OpenRouter to access the Meta Llama 3 Maverick model. The integration is handled in `src/app/api/chat/route.ts`.

### Deepgram API

Deepgram is used for speech-to-text transcription. The integration is handled in `src/app/api/transcribe/route.ts`.

## Mobile Optimization

The application is fully responsive and optimized for mobile devices:

- Tab navigation for switching between text and voice interfaces
- Responsive text sizing and spacing
- Touch-friendly buttons and inputs
- Proper viewport configuration
- Conditional display based on screen size

## Browser Compatibility

- The voice chat functionality requires a modern browser that supports:
  - MediaRecorder API for audio recording
  - Web Speech API for text-to-speech
- The text chat functionality works in all modern browsers

## License

[MIT](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenRouter](https://openrouter.ai/)
- [Deepgram](https://deepgram.com/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
