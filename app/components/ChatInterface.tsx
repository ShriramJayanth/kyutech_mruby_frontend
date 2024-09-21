"use client";
import { useEffect, useRef, useState } from 'react';

const desc="Hi I am your plant growth assistant, now shoot your questions..."

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([
    { user: 'ai', text: desc },
  ]);
  const [input, setInput] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to handle sending messages
  const sendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message to the conversation
    const newMessage = { user: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    try {
      // Send user message to the API
      const response = await fetch('http://localhost:3001/seedDiscussion/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: `context: this is a doubt from a plant growth user request: ${input} give as a sing paragraph` }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiResponse = data.reply || "Sorry, I couldn't generate a response.";

      // Add AI response to the conversation
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'ai', text: aiResponse },
      ]);
    } catch (error) {
      console.error('Error communicating with the API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'ai', text: 'Error fetching response. Please try again later.' },
      ]);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Messages Container */}
      <div className="flex-grow p-6 overflow-y-auto" ref={chatContainerRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.user === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[50%] p-4 rounded-lg ${
                  message.user === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input and Send Button */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow p-2 border rounded-lg focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <button
            className={`ml-2 p-2 text-white rounded-lg ${
              input.trim() !== ''
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            onClick={sendMessage}
            disabled={input.trim() === ''}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
