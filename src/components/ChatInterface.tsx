import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './ChatInterface.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  
  const wsRef = useRef<W3CWebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new W3CWebSocket('ws://localhost:5000/chat');
      
      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('Connected');
        console.log('WebSocket connected');
      };

      ws.onmessage = (message) => {
        try {
          // Check if the message is a string (JSON)
          if (typeof message.data === 'string') {
            const data = JSON.parse(message.data);
            if (data.type === 'answer') {
              const newMessage: Message = {
                id: Date.now().toString(),
                text: data.text,
                sender: 'assistant',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, newMessage]);
            }
          } else if (message.data instanceof ArrayBuffer) {
            // Handle binary audio data
            playAudioChunk(message.data);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('Disconnected');
        console.log('WebSocket disconnected');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioBlob.arrayBuffer().then(buffer => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(buffer);
          }
        });
        audioChunksRef.current = [];
      };

      mediaRecorder.start(100); // Collect data every 100ms
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Audio playback functions
  const playAudioChunk = async (audioData: ArrayBuffer) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    try {
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      setIsPlaying(true);
      
      source.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleRecordButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="chat-interface">
      <div className="connection-status">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
        {connectionStatus}
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation by clicking the microphone button below</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-controls">
        <button
          className={`record-button ${isRecording ? 'recording' : ''} ${isPlaying ? 'playing' : ''}`}
          onClick={handleRecordButtonClick}
          disabled={!isConnected || isPlaying}
        >
          {isRecording ? '⏹️' : isPlaying ? '🔊' : '🎤'}
        </button>
        <div className="status-text">
          {isRecording ? 'Recording...' : isPlaying ? 'Playing response...' : 'Click to speak'}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 