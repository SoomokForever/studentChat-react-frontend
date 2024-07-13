// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/register', { email, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label>아이디</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>비밀번호</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">회원가입</button>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="link">
        <a href="/login">로그인</a>
      </div>
    </div>
  );
};

export default Register;
