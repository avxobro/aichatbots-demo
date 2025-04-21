import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Message, ChatState } from '@/types';

export default function TextChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatState.isLoading) return;

    const userMessage: Message = { role: 'user', content: input };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    setInput('');

    try {
      const response = await axios.post('/api/chat', {
        messages: [...chatState.messages, userMessage],
      });

      const assistantMessage: Message = response.data.choices[0].message;

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send message. Please try again.',
      }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Text Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Send a message to start chatting
          </div>
        )}

        {chatState.messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[90%] sm:max-w-[80%] break-words ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100'
            }`}
          >
            <p className="text-sm sm:text-base">{message.content}</p>
          </div>
        ))}

        {chatState.isLoading && (
          <div className="p-3 rounded-lg bg-gray-100 max-w-[90%] sm:max-w-[80%] break-words">
            <p className="text-sm sm:text-base">Thinking...</p>
          </div>
        )}

        {chatState.error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 max-w-[90%] sm:max-w-[80%] break-words">
            <p className="text-sm sm:text-base">{chatState.error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 text-sm sm:text-base border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={chatState.isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            disabled={chatState.isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
