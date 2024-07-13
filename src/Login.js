// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', { email, password });
      console.log('Server response:', response.data); // 디버깅 로그
      setMessage(response.data.message);
      if (response.data.success) { // success 플래그 확인
        console.log('Login successful, navigating to /chatbot'); // 디버깅 로그
        navigate('/chatbot');
      }
    } catch (error) {
      console.error('Login failed:', error); // 디버깅 로그
      setMessage('Login failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <label>아이디</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>비밀번호</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">로그인</button>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="link">
        <a href="/register">회원가입</a>
      </div>
    </div>
  );
};

export default Login;
