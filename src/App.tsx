import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Handy AI Assistant</h1>
        <p>Voice-powered conversation with your documents</p>
      </header>
      <main>
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
