import React, { useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { X } from 'lucide-react';

interface ChatMessage {
  message: string;
  sender: "bot" | "user";
}

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: `${getTimeBasedGreeting()}! I'm HackConnect AI Assistant. How can I help you today?`,
      sender: "bot"
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // About HackConnect
    if (lowerMessage.includes('what is hackconnect') || lowerMessage.includes('about hackconnect')) {
      return "HackConnect is an all-in-one hackathon collaboration platform that helps participants find teammates, discover hackathons, form teams, and collaborate efficiently.";
    }

    if (lowerMessage.includes('who can use') || lowerMessage.includes('who is it for')) {
      return "HackConnect is designed for hackathon participants to find teammates and register, organizers to host and manage hackathons, and mentors & judges to guide teams and provide feedback.";
    }

    if (lowerMessage.includes('why') && (lowerMessage.includes('better') || lowerMessage.includes('discord') || lowerMessage.includes('whatsapp'))) {
      return "Unlike generic chat apps, HackConnect provides structured team matching (no spam messages), direct hackathon discovery & hosting, and all-in-one collaboration features including team formation and progress tracking.";
    }

    if (lowerMessage.includes('free') || lowerMessage.includes('cost')) {
      return "Yes! HackConnect is free for participants and open hackathons. Premium hosting features are available for organizers.";
    }

    // Authentication
    if (lowerMessage.includes('create account') || lowerMessage.includes('sign up')) {
      return "To create an account, click on 'Sign Up', enter your name, email, and password, and verify your email. It's that simple!";
    }

    if (lowerMessage.includes('google') || lowerMessage.includes('github') || lowerMessage.includes('social login')) {
      return "Currently, we support email/password login via Firebase. Social logins including Google and GitHub will be available soon!";
    }

    if (lowerMessage.includes('forgot') || lowerMessage.includes('reset') && lowerMessage.includes('password')) {
      return "To reset your password, click on 'Forgot Password?' on the login page, enter your email, and follow the instructions sent to your inbox.";
    }

    // Team Formation
    if (lowerMessage.includes('find') && (lowerMessage.includes('team') || lowerMessage.includes('teammate'))) {
      return "Use our 'Find Teammates' feature to search by role (Frontend, Backend, UI/UX, AI/ML), skills, and interests. You can also create your own team and invite others!";
    }

    if (lowerMessage.includes('create team')) {
      return "To create a team, go to 'Create Team', name your group, set your requirements, and start inviting teammates. You can then collaborate using our built-in tools.";
    }

    if (lowerMessage.includes('join multiple teams')) {
      return "Yes, you can join multiple teams, but only for different hackathons. This ensures fair participation and focused collaboration.";
    }

    // Hackathon Management
    if (lowerMessage.includes('find hackathon')) {
      return "Go to 'Explore Hackathons' and filter by date, location, or theme (AI, Web Dev, Cybersecurity, etc.). You can register directly through our platform!";
    }

    if (lowerMessage.includes('host') || lowerMessage.includes('organize')) {
      return "To host a hackathon, use our 'Host Hackathon' form to specify title, date, theme, description, registration deadline, prizes, and judges. You'll get access to a dashboard to manage participants.";
    }

    // Technical & Support
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech stack')) {
      return "HackConnect uses React, TypeScript, and Tailwind CSS for the frontend, with Firebase providing authentication and database services. This ensures security and real-time updates.";
    }

    if (lowerMessage.includes('bug') || lowerMessage.includes('issue')) {
      return "Found a bug? Click 'Report Issue' in the menu and submit the details. Our team will investigate and fix it promptly!";
    }

    // Future Plans
    if (lowerMessage.includes('new feature') || lowerMessage.includes('coming soon')) {
      return "We're working on exciting features including AI-powered teammate recommendations, a mobile app version, and direct mentor access. Stay tuned!";
    }

    // Greetings
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return `${getTimeBasedGreeting()}! How may I assist you with HackConnect today?`;
    }

    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Thank you for chatting! Have a great rest of your day. Feel free to return if you need more assistance!";
    }

    // Default response
    return "I understand your question about '" + userMessage + "'. For more specific assistance, you can also check our documentation or contact support@hackconnect.com";
  };

  const handleSend = (message: string) => {
    const newMessage: ChatMessage = {
      message,
      sender: "user"
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        message: getAIResponse(message),
        sender: "bot"
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 h-[500px] shadow-lg rounded-lg overflow-hidden z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-indigo-600 p-2 flex justify-between items-center">
        <span className="text-white font-medium">HackConnect Assistant</span>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 p-1 rounded-full"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Message List with Scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, i) => (
            <div 
              key={i} 
              className={`mb-4 ${message.sender === "bot" ? "text-left" : "text-right"}`}
            >
              <div 
                className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                  message.sender === "bot" 
                    ? "bg-gray-100 text-gray-800" 
                    : "bg-indigo-600 text-white"
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-gray-500 text-sm">AI is typing...</div>
          )}
        </div>

        {/* Fixed Message Input */}
        <div className="border-t border-gray-200 p-2 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me anything about HackConnect..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-indigo-500"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && inputMessage.trim()) {
                  handleSend(inputMessage);
                  setInputMessage('');
                }
              }}
            />
            <button
              onClick={() => {
                if (inputMessage.trim()) {
                  handleSend(inputMessage);
                  setInputMessage('');
                }
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
