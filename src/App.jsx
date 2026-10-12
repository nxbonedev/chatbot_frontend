import React, { useState } from 'react';
import IngestionForm from './components/IngestionForm';
import ChatInterface from './components/ChatInterface';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [activeUrl, setActiveUrl] = useState("");

  const handleIngestSuccess = (url) => {
    setActiveUrl(url);
    setIsReady(true);
  };

  const resetApp = () => {
    setIsReady(false);
    setActiveUrl("");
  };

  return (
    <div className="min-h-screen bg-slate-900 selection:bg-blue-500/30 font-sans">
      {!isReady ? (
        <IngestionForm onSuccess={handleIngestSuccess} />
      ) : (
        <ChatInterface ingestedUrl={activeUrl} onReset={resetApp} />
      )}
    </div>
  );
}