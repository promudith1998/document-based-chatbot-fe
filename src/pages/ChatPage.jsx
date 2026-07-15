import { useState, useEffect, useRef } from 'react';
import { conversationsAPI, documentsAPI } from '../services/api';

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { loadConversations(); loadDocuments(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  const loadConversations = async () => {
    try { const res = await conversationsAPI.getAll(); setConversations(res.data); } catch (err) { console.error(err); }
  };

  const loadDocuments = async () => {
    try { const res = await documentsAPI.getAll(); setDocuments(res.data); } catch (err) { console.error(err); }
  };

  const loadConversation = async (id) => {
    try {
      const res = await conversationsAPI.getOne(id);
      setActiveConversation(res.data);
      setMessages(res.data.messages || []);
    } catch (err) { console.error(err); }
  };

  const createConversation = async () => {
    try {
      const res = await conversationsAPI.create('New Conversation');
      setConversations((prev) => [res.data, ...prev]);
      setActiveConversation(res.data);
      setMessages([]);
    } catch (err) { console.error(err); }
  };

  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await conversationsAPI.delete(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversation?.id === id) { setActiveConversation(null); setMessages([]); }
    } catch (err) { console.error(err); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    if (!activeConversation) {
      try {
        const res = await conversationsAPI.create(input.substring(0, 50));
        setConversations((prev) => [res.data, ...prev]);
        setActiveConversation(res.data);
        sendToConversation(res.data.id, input);
      } catch (err) { console.error(err); }
      return;
    }
    sendToConversation(activeConversation.id, input);
  };

  const sendToConversation = async (conversationId, messageText) => {
    const userMsg = { id: Date.now(), role: 'USER', content: messageText, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    try {
      const docId = selectedDocId ? parseInt(selectedDocId) : null;
      const res = await conversationsAPI.sendMessage(conversationId, messageText, docId);
      setMessages((prev) => [...prev, res.data]);
      loadConversations();
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ASSISTANT', content: 'Sorry, something went wrong. Please try again.', createdAt: new Date().toISOString() }]);
    } finally { setSending(false); }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } };

  return (
    <div className="chat-layout">
      <div className="conversation-list">
        <div className="conversation-list-header">
          <h3>Chats</h3>
          <button className="btn btn-sm btn-secondary" onClick={createConversation} id="new-chat-btn">+ New</button>
        </div>
        <div className="conversation-items">
          {conversations.map((conv) => (
            <div key={conv.id} className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`} onClick={() => loadConversation(conv.id)}>
              <span className="conversation-item-title">{conv.title}</span>
              <button className="delete-btn" onClick={(e) => deleteConversation(e, conv.id)} title="Delete">✕</button>
            </div>
          ))}
          {conversations.length === 0 && <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No conversations yet</div>}
        </div>
      </div>

      <div className="chat-board">
        {activeConversation ? (
          <>
            <div className="chat-header"><h2>{activeConversation.title}</h2></div>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role.toLowerCase()}`}>
                  <div className="message-avatar">{msg.role === 'USER' ? '👤' : '🤖'}</div>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
              {sending && (
                <div className="message assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content"><div className="typing-indicator"><div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div></div></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        ) : (
          <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <h3>Start a conversation</h3>
            <p>Select an existing conversation or type a message to begin</p>
          </div>
        )}

        <div className="chat-input-area">
          {documents.length > 0 && (
            <div className="document-selector">
              <label>📄 Context:</label>
              <select value={selectedDocId} onChange={(e) => setSelectedDocId(e.target.value)} id="document-context-select">
                <option value="">None (general chat)</option>
                {documents.map((doc) => (<option key={doc.id} value={doc.id}>{doc.filename}</option>))}
              </select>
            </div>
          )}
          <form className="chat-input-wrapper" onSubmit={sendMessage}>
            <textarea className="input" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} rows={1} id="chat-input" />
            <button type="submit" className="btn btn-primary" disabled={!input.trim() || sending} id="send-message-btn">➤</button>
          </form>
        </div>
      </div>
    </div>
  );
}
