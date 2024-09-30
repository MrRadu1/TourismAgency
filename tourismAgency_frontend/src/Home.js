import './Home.css';
import SearchBar from './SearchBar';
import './SearchBar.css';
import React from 'react';
function Home() {

  function getLocationAndSave() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
      });
    } else {
      alert("Geolocation nu este suportată de acest browser.");
    }
  }

  getLocationAndSave();

  return (
    <div>
      <div className="background"></div>
      <div className="content-container">
        <SearchBar Position='absolute' />
        <div className='title'> Travel with us for fun and safety! </div>
        <div className='title2'> Embark on unforgettable journeys with our expertly curated travel experiences.  <br />
          Explore the world with confidence, as we prioritize your safety and ensure every moment is filled with excitement and joy.  <br />
          Your dream destinations await – let the adventure begin! </div>
      </div>
    </div>
  );
}

export default Home;
