import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import './Chatbot.css';

const Chatbot = ({ onRecommendation }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: language === 'hi' 
        ? "नमस्ते! मैं आपका खेती सहायक हूं। अपनी मिट्टी और मौसम की स्थिति के बारे में सरल शब्दों में बताएं, और मैं आपको फसल सिफारिशें प्राप्त करने में मदद करूंगा!"
        : "Hi! I'm your farming assistant. Tell me about your soil and weather conditions in simple terms, and I'll help you get crop recommendations!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseNaturalLanguage = (text) => {
    const lowerText = text.toLowerCase();
    const parameters = {};

    // Temperature parsing
    if (lowerText.includes('hot') || lowerText.includes('warm') || lowerText.includes('high temperature')) {
      parameters.temperature = 30;
    } else if (lowerText.includes('cool') || lowerText.includes('cold') || lowerText.includes('low temperature')) {
      parameters.temperature = 20;
    } else if (lowerText.includes('moderate temperature')) {
      parameters.temperature = 25;
    }

    // Humidity parsing
    if (lowerText.includes('humid') || lowerText.includes('high humidity')) {
      parameters.humidity = 80;
    } else if (lowerText.includes('dry') || lowerText.includes('low humidity')) {
      parameters.humidity = 40;
    } else if (lowerText.includes('moderate humidity')) {
      parameters.humidity = 60;
    }

    // Rainfall parsing
    if (lowerText.includes('heavy rain') || lowerText.includes('high rainfall') || lowerText.includes('lots of rain')) {
      parameters.rainfall = 200;
    } else if (lowerText.includes('low rain') || lowerText.includes('drought') || lowerText.includes('little rain')) {
      parameters.rainfall = 50;
    } else if (lowerText.includes('moderate rain') || lowerText.includes('normal rain')) {
      parameters.rainfall = 120;
    }

    // Soil type parsing
    if (lowerText.includes('rocky') || lowerText.includes('sandy') || lowerText.includes('poor soil')) {
      parameters.N = 20;
      parameters.P = 15;
      parameters.K = 20;
      parameters.ph = 6.5;
    } else if (lowerText.includes('fertile') || lowerText.includes('rich soil') || lowerText.includes('good soil')) {
      parameters.N = 80;
      parameters.P = 50;
      parameters.K = 60;
      parameters.ph = 6.8;
    } else if (lowerText.includes('clay') || lowerText.includes('heavy soil')) {
      parameters.N = 60;
      parameters.P = 40;
      parameters.K = 50;
      parameters.ph = 7.0;
    }

    // Location-based defaults
    if (lowerText.includes('north') || lowerText.includes('himalayan') || lowerText.includes('mountain')) {
      parameters.temperature = 18;
      parameters.humidity = 60;
      parameters.rainfall = 100;
    } else if (lowerText.includes('south') || lowerText.includes('tropical') || lowerText.includes('coastal')) {
      parameters.temperature = 28;
      parameters.humidity = 75;
      parameters.rainfall = 150;
    } else if (lowerText.includes('west') || lowerText.includes('desert') || lowerText.includes('arid')) {
      parameters.temperature = 32;
      parameters.humidity = 30;
      parameters.rainfall = 80;
    } else if (lowerText.includes('east') || lowerText.includes('plains') || lowerText.includes('delta')) {
      parameters.temperature = 26;
      parameters.humidity = 70;
      parameters.rainfall = 180;
    }

    // Set defaults for missing parameters
    if (!parameters.temperature) parameters.temperature = 25;
    if (!parameters.humidity) parameters.humidity = 60;
    if (!parameters.rainfall) parameters.rainfall = 120;
    if (!parameters.N) parameters.N = 50;
    if (!parameters.P) parameters.P = 30;
    if (!parameters.K) parameters.K = 40;
    if (!parameters.ph) parameters.ph = 6.5;

    return parameters;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const parameters = parseNaturalLanguage(inputText);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `Based on your description, I've interpreted your conditions as:
        
• Temperature: ${parameters.temperature}°C
• Humidity: ${parameters.humidity}%
• Rainfall: ${parameters.rainfall}mm
• Soil nutrients: N=${parameters.N}, P=${parameters.P}, K=${parameters.K}
• pH: ${parameters.ph}

Would you like me to get crop recommendations based on these parameters?`,
        parameters: parameters
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleGetRecommendation = (parameters) => {
    if (onRecommendation) {
      onRecommendation(parameters);
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Ask me about farming!"
      >
        <MessageCircle size={24} />
        <span className="chatbot-badge">{t.askAI}</span>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={20} />
              <span>{t.farmingAssistant}</span>
            </div>
            <button 
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  {message.parameters && (
                  <button 
                    className="recommendation-button"
                    onClick={() => handleGetRecommendation(message.parameters)}
                  >
                    {t.getCropRecommendations}
                  </button>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.describeConditions}
              className="chatbot-input-field"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="chatbot-send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
