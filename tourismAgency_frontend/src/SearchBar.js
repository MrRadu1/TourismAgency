import './Destinations.css';
import logo from './images/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function SearchBar({ backgroundColor, Position }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const username = sessionStorage.getItem('username');

  const [searchText, setSearchText] = useState('');

  const menuItems = [
    { text: 'Home', path: '/', gap: true },
    {
      text: 'Destinations',
      path: '/destinations',
      gap: false,
      hasDropdown: true
    },
    { text: <span>&#9662;</span>, path: '/', gap: false, isArrow: true },
    { text: 'Contact', path: '/contact', gap: true },
    { text: username ? username : 'Login', path: username ? `/user/${username}` : '/login', gap: true },
    { text: username ? 'Sign out' : 'Register', path: '/register', gap: false, isRegister: true },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className={`navigation-bar`} style={{ backgroundColor: backgroundColor, position: Position }}>
      <img src={logo} alt="Logo" style={{ width: '8%', height: 'auto' }} />
      <div className="menu-item" style={{ marginRight: '7%', fontSize: '27px', width: '200px' }}>
        <span>SR7 Adventures</span>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." value={searchText} onChange={(e) => { setSearchText(e.target.value); e.stopPropagation(); }} />
        <div className='black-box2'>
          <span onClick={() => { navigate(`/destinationsSearch?search=${searchText}&leftDate=&rightDate=`); window.location.reload(); }}>Search</span>
        </div>
      </div>
      {menuItems.map((item, index) => (
        <div key={index} className={`${index === 2 ? 'arrow' : 'menu-item'} ${item.gap ? 'gap' : ''}`}>
          {item.hasDropdown && isDropdownOpen ? (
            <div className="black-box">
              <span style={{ cursor: 'pointer' }} onClick={() => navigate(item.path)}>{item.text}</span>
              <div style={{ cursor: 'pointer', color: '#EC3030', marginTop: '10px' }} onClick={() => navigate('/destinations#topDeals')}>Discounts !</div>
            </div>
          ) : (
            <div>
              {item.isArrow ? (
                <div onClick={() => setDropdownOpen(!isDropdownOpen)}>{item.text}</div>
              ) : (
                <span
                  style={{ cursor: 'pointer', color: isActive(item.path) ? 'white' : 'black' }}
                  onClick={() => {
                    if (index === 1)
                      setDropdownOpen(!isDropdownOpen)
                    else if (item.text === 'Sign out')
                      handleLogout();
                    else
                      navigate(item.path)
                  }}>
                  {item.text}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SearchBar;
