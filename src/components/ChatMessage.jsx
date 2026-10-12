import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-blue-600" : "bg-emerald-600"}`}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={`max-w-[80%] p-4 rounded-2xl ${
        isUser 
          ? "bg-blue-600 text-white rounded-tr-sm shadow-md" 
          : "bg-slate-700 text-slate-100 rounded-tl-sm shadow-md"
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}