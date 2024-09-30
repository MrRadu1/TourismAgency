import './Contact.css';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';

import React, { useState } from 'react';
function Contact() {
  
return (
  
    
    <div className="content-container">
       <SearchBar backgroundColor="#857858" Position='relative'/>
      <div className="contact-container">
      <div className="box">
        <h2 className="box-title">Get in touch</h2>
        <p className="box-text">Whether you have questions about our travel packages, need assistance planning your next adventure, or simply want to share your travel aspirations, we're here to help. Reach out to our friendly team, and let's turn your travel dreams into reality. Your journey starts with a simple message. Connect with us today!</p>
        <div className="text-fields">
          <label htmlFor="field1">Name:</label>
          <textarea type="text" id="field1" name="field1" />

          <label htmlFor="field2">Email:</label>
          <textarea type="text" id="field2" name="field2" />

          <label htmlFor="field3">Message:</label>
          <textarea type="text" id="field3" name="field3" style={{height : '150px'}}  />
        </div>
        <button className="submit-button">Submit</button>
      </div>
    </div>
    <div className="background2"></div>
    </div>
);

  
}

export default Contact;
