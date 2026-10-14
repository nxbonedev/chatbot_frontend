import React, { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';

export default function IngestionForm({ onSuccess }) {
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      if (response.ok) {
        onSuccess(urlInput);
      } else {
        const errText = await response.text();
        setError(`Failed to ingest: ${errText}`);
      }
    } catch (err) {
      setError("Could not connect to the FastAPI backend. Is it running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <Globe className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          RAGify
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Transform any website into a live, interactive chatbot.
        </p>

        <form onSubmit={handleIngest} className="space-y-4">
          <div>
            <input
              type="url"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-500 text-slate-100"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
            ) : (
              "Generate Chatbot"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}