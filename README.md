# Handy AI Assistant - React Frontend

A modern React frontend for the Handy AI Assistant, providing a voice-powered chat interface that connects to your Flask backend.

## Features

- 🎤 **Voice Recording**: Click the microphone button to start recording your voice
- 🔊 **Real-time Audio Playback**: Listen to AI responses through your speakers
- 💬 **Chat Interface**: Clean, modern chat UI with message history
- 🔌 **WebSocket Connection**: Real-time communication with the backend
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradients and smooth animations

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- The Flask backend running on `localhost:5000`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The app will open in your browser at `http://localhost:3000`.

## Usage

1. **Start the Backend**: Make sure your Flask backend is running on `localhost:5000`
2. **Connect**: The frontend will automatically attempt to connect to the WebSocket
3. **Record**: Click the microphone button to start recording your voice
4. **Speak**: Ask your question or make your request
5. **Stop**: Click the stop button to end recording and send your audio
6. **Listen**: The AI response will be played back through your speakers

## Connection Status

- 🟢 **Connected**: Ready to record and chat
- 🔴 **Disconnected**: Check if the backend is running
- ⚠️ **Error**: There was an issue connecting to the backend

## Browser Compatibility

This app requires a modern browser with support for:
- WebSocket API
- MediaRecorder API
- AudioContext API
- getUserMedia API

Recommended browsers:
- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+

## Development

### Project Structure

```
src/
├── components/
│   ├── ChatInterface.tsx    # Main chat component
│   └── ChatInterface.css    # Chat component styles
├── App.tsx                  # Main app component
├── App.css                  # App-level styles
└── index.tsx               # App entry point
```

### Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

### Environment Variables

You can configure the WebSocket URL by setting the `REACT_APP_WS_URL` environment variable:

```bash
REACT_APP_WS_URL=ws://localhost:5000/chat npm start
```

## Troubleshooting

### Connection Issues
- Ensure the Flask backend is running on `localhost:5000`
- Check that the WebSocket endpoint `/chat` is available
- Verify your firewall isn't blocking the connection

### Audio Issues
- Allow microphone permissions when prompted
- Check that your microphone is working in other applications
- Ensure your speakers/headphones are connected and working

### Build Issues
- Clear the `node_modules` folder and run `npm install` again
- Check that you're using a compatible Node.js version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Handy AI Assistant application.
