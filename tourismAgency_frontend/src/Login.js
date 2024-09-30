import SearchBar from './SearchBar';
import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const result = await response.json();
        const decodedToken = jwtDecode(result.token); 
        sessionStorage.setItem('username', decodedToken.username);
        sessionStorage.setItem('role', decodedToken.role);
        sessionStorage.setItem('token', result.token);
        navigate(`/user/${decodedToken.username}`); 
      } else {
        console.log('Login failed!');
      }
    } catch (error) {
      console.log('Error during login:', error);
    }
  };


  return (
    <div className="content-container">
      <SearchBar backgroundColor="#857858" Position='relative' />
      <div className="abox">
        <div className="text-fields">
          <label htmlFor="field1">Username:</label>
          <input className='input-register' type="text" id="field1" name="field1" value={username} onChange={handleUsernameChange} />

          <label htmlFor="field2">Password:</label>
          <input className='input-register' type="password" id="field2" name="field2" value={password} onChange={handlePasswordChange} />
        </div>
        <button className="submit-button" style={{ padding: '10px 200px' }} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Login;