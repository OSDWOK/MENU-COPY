
import React from 'react';
import { Message, Sender } from '../types';

interface ChatMessageProps {
  message: Message;
}

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-400">
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0118 10.5c0 5.385-4.365 9.75-9.75 9.75S-1.5 15.885-1.5 10.5a9.75 9.75 0 015.037-8.521.75.75 0 00-1.052-1.072A11.25 11.25 0 000 10.5c0 6.215 5.035 11.25 11.25 11.25S22.5 16.715 22.5 10.5c0-4.353-2.4-8.11-5.964-9.862A11.248 11.248 0 0012.963 2.286z" clipRule="evenodd" />
        <path d="M12 7.5a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V8.25A.75.75 0 0112 7.5zM12 15a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
    </svg>
);


const WokIcon = () => (
    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
         <path d="M13.483 5.691L14.309 4.865a.5.5 0 01.707 0l1.414 1.414a.5.5 0 010 .707l-.826.826-3.12-3.12zM10.5 8.586l-3.12-3.12-.826.826a.5.5 0 01-.707 0L4.434 5.88a.5.5 0 010-.707l.826-.826L8.58 7.5l1.92-1.92zM12.5 7.5a.5.5 0 01.5.5v2.5a.5.5 0 01-1 0v-2.5a.5.5 0 01.5-.5z" />
         <path d="M4.682 13.431A2 2 0 013 12.5V11a2 2 0 012-2h1.5v3.5a2.5 2.5 0 002.28 2.45l.19.022a2.5 2.5 0 002.45-2.28l.022-.19V9H13a2 2 0 012 2v1.5a2 2 0 01-1.682 1.931l-3.32.743-3.318-.743z" />
       </svg>
    </div>
);


const UserIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 font-bold shadow-md">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.992 9.992 0 0010 12c-2.31 0-4.438.784-6.131 2.095z" />
    </svg>
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === Sender.Bot;

  const messageClasses = isBot
    ? 'bg-gray-800'
    : 'bg-orange-600 self-end';
  
  const containerClasses = isBot ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex items-start my-3 gap-3 ${containerClasses}`}>
      {isBot && <WokIcon />}
      <div className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg shadow-lg ${messageClasses}`}>
        <p className="text-white whitespace-pre-wrap">{message.text}</p>
      </div>
       {!isBot && <UserIcon />}
    </div>
  );
};

export default ChatMessage;
