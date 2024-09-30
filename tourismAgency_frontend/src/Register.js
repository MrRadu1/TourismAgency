import SearchBar from './SearchBar';
import React, { useState } from 'react';
import './Auth.css';

function Register() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name, last_name, email, username, password })
      });
    } catch (error) {
      console.log('Error during login:', error);
    }
  };

  return (
    <div className="content-container">
      <SearchBar backgroundColor="#857858" Position='relative' />
      <div className="abox" style={{ height: '500px' }}>
        <div className="text-fields">
          <label htmlFor="field1">First Name:</label>
          <input className='input-register' type="text" id="field1" name="field1" value={first_name} onChange={handleFirstNameChange} />

          <label htmlFor="field2">Last Name:</label>
          <input className='input-register' type="text" id="field2" name="field2" value={last_name} onChange={handleLastNameChange} />

          <label htmlFor="field3">Username:</label>
          <input className='input-register' type="text" id="field3" name="field3" value={username} onChange={handleUsernameChange} />

          <label htmlFor="field4" >Email:</label>
          <input className='input-register' type="text" id="field4" name="field4" value={email} onChange={handleEmailChange} />

          <label htmlFor="field5">Password:</label>
          <input className='input-register' type="password" id="field5" name="field5" value={password} onChange={handlePasswordChange} />
        </div>
        <button className="submit-button" style={{ padding: '10px 200px' }} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Register;
