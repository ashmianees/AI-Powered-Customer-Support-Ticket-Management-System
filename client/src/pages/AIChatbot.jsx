import React, { useState, useEffect, useRef, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Bot, Send, Trash2, Sparkles } from 'lucide-react';

const AIChatbot = () => {
  const { showToast } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/chat/history');
        if (data.success) {
          setMessages(data.history);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    const tempMessage = {
      _id: Date.now(),
      userMessage: userText,
      aiResponse: null
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const { data } = await API.post('/chat', { userMessage: userText });
      if (data.success) {
        setMessages(prev => prev.map(m => (m._id === tempMessage._id ? data.chat : m)));
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to reach AI assistant', 'error');
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      const { data } = await API.delete('/chat/history');
      if (data.success) {
        setMessages([]);
        showToast('Chat history cleared', 'success');
      }
    } catch (error) {
      showToast('Failed to clear history', 'error');
    }
  };

  if (loading) return <LoadingSpinner text="Connecting to Gemini AI..." />;

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Bot size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Gemini AI Support Virtual Assistant <Sparkles size={16} color="#eab308" />
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }}></span> Online 24/7
            </span>
          </div>
        </div>

        {messages.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="btn btn-secondary btn-sm"
            title="Clear Chat History"
          >
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', padding: '2rem', maxWidth: '480px' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', marginBottom: '1rem' }}>
              <Bot size={40} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>How can I help you today?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Ask me about account settings, technical errors, billing queries, or how to submit support tickets.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setInputMessage('How do I submit a new support ticket?')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                "How do I submit a support ticket?"
              </button>
              <button 
                onClick={() => setInputMessage('What are your technical support hours?')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                "What are support hours?"
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <React.Fragment key={msg._id || index}>
              {/* User Message */}
              <div className="message-bubble user">
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem', fontWeight: 600 }}>You</div>
                {msg.userMessage}
              </div>

              {/* AI Message */}
              {msg.aiResponse ? (
                <div className="message-bubble ai">
                  <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginBottom: '0.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Bot size={14} /> Gemini AI
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.aiResponse}</div>
                </div>
              ) : (
                <div className="message-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <span className="spinner" style={{ width: '16px', height: '16px' }}></span> Thinking...
                </div>
              )}
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="chat-input-area">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message or technical question..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isSending}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSending || !inputMessage.trim()}
          style={{ padding: '0.75rem 1.25rem' }}
        >
          {isSending ? <span className="spinner"></span> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default AIChatbot;
