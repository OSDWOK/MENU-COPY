
import React, { useState, useRef, useEffect } from 'react';
import { Message, Sender } from '../types';
import { GREETING_MESSAGE } from '../constants';
import ChatMessage from './ChatMessage';
import { generateResponse } from '../services/geminiService';

interface ChatWindowProps {
  isThinkingMode: boolean;
}

const LoadingIndicator = () => (
  <div className="flex items-start my-3 gap-3 justify-start">
    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
         <path d="M13.483 5.691L14.309 4.865a.5.5 0 01.707 0l1.414 1.414a.5.5 0 010 .707l-.826.826-3.12-3.12zM10.5 8.586l-3.12-3.12-.826.826a.5.5 0 01-.707 0L4.434 5.88a.5.5 0 010-.707l.826-.826L8.58 7.5l1.92-1.92zM12.5 7.5a.5.5 0 01.5.5v2.5a.5.5 0 01-1 0v-2.5a.5.5 0 01.5-.5z" />
         <path d="M4.682 13.431A2 2 0 013 12.5V11a2 2 0 012-2h1.5v3.5a2.5 2.5 0 002.28 2.45l.19.022a2.5 2.5 0 002.45-2.28l.022-.19V9H13a2 2 0 012 2v1.5a2 2 0 01-1.682 1.931l-3.32.743-3.318-.743z" />
       </svg>
    </div>
    <div className="max-w-md lg:max-w-2xl px-4 py-3 rounded-lg shadow-lg bg-gray-800 flex items-center space-x-2">
      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.54l3.852-1.101a.75.75 0 000-1.392L3.23 4.29a.75.75 0 00-.125-.001z" />
        <path d="M15 9.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" />
        <path d="M3.902 11.252a.75.75 0 00-.95.54l-1.414 4.95a.75.75 0 00.95.826l4.95-1.414a.75.75 0 00.54-.95l-1.102-3.852a.75.75 0 00-1.392 0L3.902 11.252z" />
    </svg>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ isThinkingMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-greeting',
      text: GREETING_MESSAGE,
      sender: Sender.Bot,
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: Sender.User,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    const botResponseText = await generateResponse(newMessages, isThinkingMode);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: Sender.Bot,
    };

    setMessages(prevMessages => [...prevMessages, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="flex flex-col">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Digite a ficha técnica ou sua mensagem aqui..."
            className="flex-1 p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="p-3 bg-orange-600 rounded-full text-white hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
