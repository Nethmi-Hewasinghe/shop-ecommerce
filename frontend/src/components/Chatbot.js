import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
    FaRobot, FaTimes, FaPaperPlane, FaTruck, 
    FaPhone, FaEnvelope, FaWhatsapp, FaCommentDots 
} from 'react-icons/fa';

// Styled Components for a Modern & Cute Look
const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 350px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(255, 77, 109, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: ${(props) => (props.$isOpen ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0)')};
  opacity: ${(props) => (props.$isOpen ? '1' : '0')};
  height: 520px;
  background: #fff5f7;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  border: 1px solid #ffe1e9;
`;

const ChatHeader = styled.div`
  background: linear-gradient(45deg, #ff4d6d, #ff85a2) !important;
  color: white;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  user-select: none;
  box-shadow: 0 2px 10px rgba(214, 51, 132, 0.1);
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 15px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ffccd5;
    border-radius: 10px;
  }
`;

const Message = styled.div`
  max-width: 85%;
  margin: 8px 0;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-line;
  border-radius: ${(props) => (props.$isBot ? '18px 18px 18px 5px' : '18px 18px 5px 18px')};
  background: ${(props) => (props.$isBot ? '#f0f2f5' : 'linear-gradient(45deg, #ff4d6d, #ff85a2)')};
  color: ${(props) => (props.$isBot ? '#444' : '#fff')};
  align-self: ${(props) => (props.$isBot ? 'flex-start' : 'flex-end')};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
`;

const InputContainer = styled.div`
  display: flex;
  padding: 15px;
  background: white;
  border-top: 1px solid #ffe1e9;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  border: 2px solid #fff0f3;
  border-radius: 25px;
  padding: 10px 18px;
  outline: none;
  margin-right: 10px;
  font-size: 14px;
  background: #fffafb;
  transition: border-color 0.2s;
  &:focus {
    border-color: #ff85a2;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(45deg, #ff4d6d, #ff85a2) !important;
  color: white;
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
  &:disabled {
    background: #ccc !important;
  }
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff4d6d, #ff85a2) !important;
  color: white;
  border: none;
  box-shadow: 0 8px 25px rgba(255, 77, 109, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: all 0.3s ease;
  transform: ${(props) => (props.$isOpen ? 'rotate(90deg) scale(0)' : 'rotate(0) scale(1)')};

  &:hover {
    box-shadow: 0 12px 30px rgba(255, 77, 109, 0.5);
    transform: translateY(-5px);
  }
`;

const QuickRepliesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 5px 0 15px;
  justify-content: ${(props) => (props.$isBot ? 'flex-start' : 'flex-end')};
`;

const QuickReplyButton = styled.button`
  padding: 8px 15px;
  background: #fff;
  border: 1px solid #ffccd5;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  color: #ff4d6d;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background: #fff0f3;
    border-color: #ff4d6d;
    transform: scale(1.05);
  }
`;

const ActionButton = styled.a`
  display: inline-block;
  padding: 6px 12px;
  background: #fff;
  color: #ff4d6d;
  border: 1.5px solid #ff4d6d;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  margin: 5px 5px 0 0;
  transition: all 0.2s;

  &:hover {
    background: #ff4d6d;
    color: white;
    text-decoration: none;
  }
`;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            text: '🌸 Hello! Welcome to UniBuy. How can I assist you today?', 
            isBot: true,
            quickReplies: ['Order Status', 'Shipping Info', 'Returns', 'Contact Support']
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = (e) => {
        e?.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userMessage = { text: inputValue, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = getBotResponse(inputValue);
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const handleQuickReply = (reply) => {
        if (isTyping) return;
        setInputValue(reply);
        handleSendMessage();
    };

    const getBotResponse = (message) => {
        const lowerCaseMessage = message.toLowerCase();

        if (/(hi|hello|hey|greetings)/i.test(lowerCaseMessage)) {
            return {
                text: "Hello! I'm your assistant. How can I help you today? 🎀",
                isBot: true,
                quickReplies: ['Order Status', 'Shipping Info', 'Returns']
            };
        }

        if (/(order status|track order|where is my order)/i.test(lowerCaseMessage)) {
            return {
                text: `📦 Order Status\n\nTo check your status, visit 'My Orders' in your account.`,
                isBot: true,
                actions: [
                    { text: 'View My Orders', url: '/orders' }
                ]
            };
        }

        if (/(shipping|delivery|how long)/i.test(lowerCaseMessage)) {
            return {
                text: `🚚 Shipping Information\n\n• Standard: 3-5 business days\n• Express: 1-2 business days\n• Free on orders over Rs. 5,000`,
                isBot: true,
                quickReplies: ['Track Order', 'Shipping Rates']
            };
        }

        if (/(return|refund|exchange)/i.test(lowerCaseMessage)) {
            return {
                text: `🔄 Returns & Refunds\n\n• 14-day return policy\n• Must be unused with tags attached.`,
                isBot: true,
                actions: [
                    { text: 'Contact Support', url: '/contact' }
                ]
            };
        }

        if (/(contact|support|help)/i.test(lowerCaseMessage)) {
            return {
                text: `📞 Contact Us\n\n• Email: support@unibuy.lk\n• WhatsApp: +94 76 123 4567`,
                isBot: true,
                actions: [
                    { text: <><FaEnvelope /> Email</>, url: 'mailto:support@unibuy.lk' },
                    { text: <><FaWhatsapp /> WhatsApp</>, url: 'https://wa.me/94761234567' }
                ]
            };
        }

        return {
            text: "I'm sorry, I didn't quite get that. Here is what I can help with:",
            isBot: true,
            quickReplies: ['Order Status', 'Shipping Info', 'Returns']
        };
    };

    return (
        <>
            <ChatbotButton onClick={() => setIsOpen(true)} $isOpen={isOpen}>
                <FaCommentDots size={28} />
            </ChatbotButton>

            <ChatbotContainer $isOpen={isOpen}>
                <ChatHeader onClick={() => setIsOpen(false)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaRobot style={{ marginRight: '10px', fontSize: '20px' }} />
                        <span>Support Assistant</span>
                    </div>
                    <FaTimes style={{ cursor: 'pointer' }} />
                </ChatHeader>
                
                <ChatContent>
                    {messages.map((message, index) => (
                        <React.Fragment key={index}>
                            <Message $isBot={message.isBot}>
                                {message.text}
                                {message.actions && (
                                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {message.actions.map((action, i) => (
                                            <ActionButton key={i} href={action.url} target="_blank">{action.text}</ActionButton>
                                        ))}
                                    </div>
                                )}
                            </Message>
                            {message.quickReplies && (
                                <QuickRepliesContainer $isBot={message.isBot}>
                                    {message.quickReplies.map((reply, i) => (
                                        <QuickReplyButton key={i} onClick={() => handleQuickReply(reply)}>
                                            {reply}
                                        </QuickReplyButton>
                                    ))}
                                </QuickRepliesContainer>
                            )}
                        </React.Fragment>
                    ))}
                    {isTyping && (
                        <Message $isBot={true}>🌸 Thinking...</Message>
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
            </ChatbotContainer>
        </>
    );
};

export default Chatbot;