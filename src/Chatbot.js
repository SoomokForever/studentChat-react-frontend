import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Chatbot.module.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [animatedMessage, setAnimatedMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const chatWindowRef = useRef(null);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5001/api/chat', { message: input });
      const botMessage = response.data.reply;
      setTyping(true);
      setAnimatedMessage('');
      animateBotMessage(botMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const botMessage = response.data.reply;
      setTyping(true);
      setAnimatedMessage('');
      animateBotMessage(botMessage);
      setMessages((prevMessages) => [...prevMessages, { text: file.name, sender: 'user' }]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const animateBotMessage = (message) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setAnimatedMessage((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
        setTyping(false);
        setMessages((prevMessages) => [...prevMessages, { text: `You said: ${message}`, sender: 'bot' }]);
      }
    }, 50);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, typing]);

  return (
    <div className={`${styles.chatbotContainer} ${darkMode ? styles.darkMode : ''}`}>
      <div className={`${styles.sidebar} ${sidebarVisible ? '' : styles.hideSidebar}`}>
        <button onClick={() => setDarkMode(!darkMode)} className={styles.darkModeButton}>
          {darkMode ? '라이트 모드' : '다크 모드'}
        </button>
        <div className={styles.chatHistory}>
          <h3>채팅 내역</h3>
          {messages.map((msg, index) => (
            <div key={index} className={styles.historyItem}>
              {msg.text}
            </div>
          ))}
        </div>
        <button onClick={() => setSidebarVisible(!sidebarVisible)} className={styles.toggleSidebarButton}>
          {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
        </button>
      </div>
      <div className={styles.chatMain}>
        <div className={styles.chatWindow} ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.chatMessage} ${styles[msg.sender]}`}>
              {msg.text}
            </div>
          ))}
          {typing && (
            <div className={`${styles.chatMessage} ${styles.bot}`}>
              <span className={styles.fixedText}>You said: </span>
              <span>{animatedMessage}</span>
            </div>
          )}
        </div>
        <div className={styles.chatInput}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className={styles.chatInputText}
          />
          <button onClick={handleSend} className={styles.chatInputButton}>전송</button>
          <input type="file" onChange={handleFileUpload} className={styles.chatInputFile} />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
