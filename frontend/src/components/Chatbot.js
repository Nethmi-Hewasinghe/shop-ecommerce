// frontend/src/components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaRobot, FaTimes, FaPaperPlane, FaShoppingBag, FaTruck, FaCreditCard, FaUndo, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

// Styled Components
const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 350px;
  max-width: 90vw;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'translateY(0)' : 'translateY(calc(100% - 60px))')};
  height: ${(props) => (props.isOpen ? '500px' : '60px')};
  background: white;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
`;

const ChatHeader = styled.div`
  background: #6c63ff;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  padding: 15px;
  overflow-y: auto;
  max-height: 400px;
  min-height: 200px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
    &:hover {
      background: #a8a8a8;
    }
  }
`;

const Message = styled.div`
  max-width: 85%;
  margin: 5px 0;
  padding: 10px 15px;
  border-radius: 15px;
  background: ${(props) => (props.isBot ? '#fff' : '#6c63ff')};
  color: ${(props) => (props.isBot ? '#333' : '#fff')};
  align-self: ${(props) => (props.isBot ? 'flex-start' : 'flex-end')};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  line-height: 1.4;
  white-space: pre-line;
  font-size: 14px;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background: white;
  border-top: 1px solid #eee;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 15px;
  outline: none;
  margin-right: 10px;
  font-size: 14px;
  &:focus {
    border-color: #6c63ff;
  }
`;

const SendButton = styled.button`
  background: #6c63ff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #5a52d4;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #6c63ff;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: all 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'scale(0)' : 'scale(1)')};
  opacity: ${(props) => (props.isOpen ? '0' : '1')};

  &:hover {
    transform: ${(props) => (props.isOpen ? 'scale(0)' : 'scale(1.1)')};
    background: #5a52d4;
  }
`;

const QuickRepliesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 5px 0 15px;
  justify-content: ${(props) => (props.isBot ? 'flex-start' : 'flex-end')};
`;

const QuickReplyButton = styled.button`
  padding: 5px 12px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
  white-space: nowrap;

  &:hover {
    background: #e0e0e0;
  }
`;

const ActionButton = styled.a`
  display: inline-block;
  padding: 5px 10px;
  background: #6c63ff;
  color: white;
  border-radius: 15px;
  font-size: 12px;
  text-decoration: none;
  margin: 5px 5px 0 0;
  transition: all 0.2s;

  &:hover {
    background: #5a52d4;
    color: white;
    text-decoration: none;
  }
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: 'Hello! 👋 Welcome to StudentShop. How can I assist you today?', 
      isBot: true,
      quickReplies: ['Order Status', 'Shipping Info', 'Returns', 'Payment Methods']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateTyping = (callback) => {
    setIsTyping(true);
    setTimeout(() => {
      callback();
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    // Add user message
    const userMessage = { text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    simulateTyping(() => {
      const botResponse = getBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
    });
  };

  const handleQuickReply = (reply) => {
    if (isTyping) return;
    setInputValue(reply);
    handleSendMessage({ preventDefault: () => {} });
  };

  const getBotResponse = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    // Greetings
    if (/(hi|hello|hey|greetings|good\s(morning|afternoon|evening))/i.test(lowerCaseMessage)) {
      return {
        text: "Hello! I'm your StudentShop assistant. How can I help you today?",
        isBot: true,
        quickReplies: ['Order Status', 'Shipping Info', 'Returns', 'Contact Support']
      };
    }

    // Order Status
    if (/(order status|track order|where is my order|order tracking)/i.test(lowerCaseMessage)) {
      return {
        text: `📦 Order Status\n\nTo check your order status, please enter your order number or visit the 'My Orders' section in your account. You can also track your order directly using the tracking number provided in your confirmation email.`,
        isBot: true,
        actions: [
          { text: 'View My Orders', url: '/orders' },
          { text: 'Track Order', url: '/track-order' }
        ]
      };
    }

    // Shipping Information
    if (/(shipping|delivery|when will i get|how long|shipping time)/i.test(lowerCaseMessage)) {
      return {
        text: `🚚 Shipping Information\n\n• Standard Shipping: 3-5 business days\n• Express Shipping: 1-2 business days\n• Free shipping on orders over Rs. 5,000\n• We ship to all major cities in Sri Lanka\n• You'll receive tracking information once your order ships`,
        isBot: true,
        quickReplies: ['Track Order', 'Shipping Rates', 'International Shipping']
      };
    }

    // Returns and Refunds
    if (/(return|refund|exchange|wrong item|damaged)/i.test(lowerCaseMessage)) {
      return {
        text: `🔄 Returns & Refunds\n\n• 14-day return policy\n• Items must be unused with tags attached\n• Original receipt required\n• Refunds processed within 3-5 business days\n\nTo start a return, please contact our support team.`,
        isBot: true,
        actions: [
          { text: 'Start a Return', url: '/contact' },
          { text: 'Contact Support', url: '/contact' }
        ]
      };
    }

    // Payment Methods
    if (/(payment|pay|credit card|debit card|cash on delivery|cod|paypal)/i.test(lowerCaseMessage)) {
      return {
        text: `💳 Payment Methods\n\n• Cash on Delivery (COD)\n• Credit/Debit Cards (Visa, MasterCard, AMEX)\n• Online Bank Transfers\n• Mobile Payments (Visa, MasterCard, AMEX)\n\nAll transactions are secure and encrypted. We never store your payment details.`,
        isBot: true,
        quickReplies: ['Place Order', 'Payment Security', 'Contact Support']
      };
    }

    // Contact Information
    if (/(contact|support|help|talk to someone|customer service)/i.test(lowerCaseMessage)) {
      return {
        text: `📞 Contact Information\n\n• Email: support@studentshop.lk\n• Phone: +94 11 234 5678\n• WhatsApp: +94 76 123 4567\n• Hours: Mon-Sat, 9:00 AM - 6:00 PM\n\nOur team typically responds within 1 business hour.`,
        isBot: true,
        actions: [
          { text: <><FaEnvelope /> Email Us</>, url: 'mailto:support@studentshop.lk' },
          { text: <><FaPhone /> Call Us</>, url: 'tel:+94112345678' },
          { text: <><FaWhatsapp /> WhatsApp</>, url: 'https://wa.me/94761234567' }
        ]
      };
    }

    // Default response
    return {
      text: "I'm sorry, I didn't understand that. Here are some things I can help with:",
      isBot: true,
      quickReplies: ['Order Status', 'Shipping Info', 'Returns', 'Contact Support']
    };
  };

  return (
    <>
      {!isOpen && (
        <ChatbotButton onClick={() => setIsOpen(true)} isOpen={isOpen}>
          <FaRobot size={24} />
        </ChatbotButton>
      )}

      <ChatbotContainer isOpen={isOpen}>
        <ChatHeader onClick={() => setIsOpen(!isOpen)}>
          <div>
            <FaRobot style={{ marginRight: '10px' }} />
            StudentShop Assistant
          </div>
          <FaTimes 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }} 
            style={{ cursor: 'pointer' }}
          />
        </ChatHeader>
        
        {isOpen && (
          <>
            <ChatContent>
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <Message isBot={message.isBot}>
                    {message.text}
                    {message.actions && (
                      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {message.actions.map((action, i) => (
                          <ActionButton 
                            key={i} 
                            href={action.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {action.text}
                          </ActionButton>
                        ))}
                      </div>
                    )}
                  </Message>
                  {message.quickReplies && (
                    <QuickRepliesContainer isBot={message.isBot}>
                      {message.quickReplies.map((reply, i) => (
                        <QuickReplyButton
                          key={i}
                          onClick={() => handleQuickReply(reply)}
                          disabled={isTyping}
                        >
                          {reply}
                        </QuickReplyButton>
                      ))}
                    </QuickRepliesContainer>
                  )}
                </React.Fragment>
              ))}
              {isTyping && (
                <Message isBot={true}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <div className="typing-dot" style={{ 
                      height: '8px', 
                      width: '8px', 
                      backgroundColor: '#6c63ff', 
                      borderRadius: '50%',
                      animation: 'typing 1s infinite',
                      animationDelay: '0s'
                    }}></div>
                    <div className="typing-dot" style={{ 
                      height: '8px', 
                      width: '8px', 
                      backgroundColor: '#6c63ff', 
                      borderRadius: '50%',
                      animation: 'typing 1s infinite',
                      animationDelay: '0.2s'
                    }}></div>
                    <div className="typing-dot" style={{ 
                      height: '8px', 
                      width: '8px', 
                      backgroundColor: '#6c63ff', 
                      borderRadius: '50%',
                      animation: 'typing 1s infinite',
                      animationDelay: '0.4s'
                    }}></div>
                  </div>
                </Message>
              )}
              <div ref={messagesEndRef} />
            </ChatContent>
            
            <form onSubmit={handleSendMessage}>
              <InputContainer>
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isTyping}
                />
                <SendButton type="submit" disabled={!inputValue.trim() || isTyping}>
                  <FaPaperPlane />
                </SendButton>
              </InputContainer>
            </form>
          </>
        )}
      </ChatbotContainer>

      <style jsx global>{`
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;