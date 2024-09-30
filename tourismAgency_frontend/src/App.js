import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Contact from './Contact';
import Destinations from './Destinations';
import Login from './Login';
import Register from './Register';
import DestinationsSearch from './DestinationSearch';
import Admin from './Admin';

const App = () => {
  return (
     
   <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/destinationsSearch" element={<DestinationsSearch />} />
      <Route path="/user/*" element={<Admin />} />
    </Routes>
  </Router>
  
  );
};

export default App;
