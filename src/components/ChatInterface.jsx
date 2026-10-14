import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowLeft } from 'lucide-react';
import ChatMessage from './ChatMessage';

export default function ChatInterface({ ingestedUrl, onReset }) {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [parentId, setParentId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuestion = chatInput;
    setChatInput("");
    
    const newMessages = [...messages, { role: "user", content: userQuestion }];
    setMessages(newMessages);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          session_id: sessionId,
          parent_id: parentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.session_id);
        setParentId(data.assistant_message_id);
        setMessages([...newMessages, { role: "assistant", content: data.answer || "No answer provided." }]);
      } else {
        const errText = await response.text();
        setError(`Backend Error: ${errText}`);
      }
    } catch (err) {
      setError("Lost connection to the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto shadow-2xl bg-slate-800/30 text-slate-100">
      <header className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="font-semibold text-lg">Website Assistant</h2>
            <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">{ingestedUrl}</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">New URL</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
            <Bot className="w-16 h-16 opacity-20" />
            <p>Ask a question about the ingested site to get started.</p>
          </div>
        ) : (
          // Standard React mapping equivalent to Python's enumerate to track index
          messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} content={msg.content} />
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-4 flex-row">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-700 rounded-tl-sm shadow-md flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-3 text-sm text-center text-red-400 bg-red-400/10 rounded-lg border border-red-400/20 my-4">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-700">
        <form onSubmit={handleChat} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !chatInput.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}