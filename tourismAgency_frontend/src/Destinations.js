import Card from './Card';
import './Destinations.css';
import SearchBar from './SearchBar';
import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Destinations() {

  const [leftDate, setLeftDate] = useState("");
  const [rightDate, setRightDate] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const location = useLocation();

  const handleSearchDate = () => {
    if (!(leftDate === "" || rightDate === "")) {
      navigate(`/destinationsSearch?search=&leftDate=${leftDate}&rightDate=${rightDate}`);
    }
  }

  useEffect(() => {
    const scrollToTarget = () => {
      if (location.hash) {
        const targetElement = document.getElementById(location.hash.slice(1));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    const delay = 100;
    const timeoutId = setTimeout(scrollToTarget, delay);
    return () => clearTimeout(timeoutId);
  }, [location.hash]);

  useEffect(() => {
    const endpointUrl = 'http://127.0.0.1:5000/destinations';
    const token = sessionStorage.getItem('token'); 
    fetch(endpointUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-tokens': token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="content-container">
      <SearchBar backgroundColor="#857858" Position='relative' />
      <div className="x-cont">
        <div className="rectangle-container2">
          <input type="date" id="leftDate" className="date-input" style={{ cursor: 'pointer' }} max={rightDate} onChange={(e) => setLeftDate(e.target.value)} />
          <div className="horizontal-line2"></div>
        </div>
        <div className="vertical-line"></div>
        <div className="rectangle-container2">
          <input type="date" id="rightDate" className="date-input" style={{ cursor: 'pointer' }} min={leftDate} onChange={(e) => setRightDate(e.target.value)} />
          <div className="horizontal-line2"></div>
        </div>
      </div>
      <div className='black-box2' style={{ marginTop: '2%', width: '5%', display: 'flex', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center' }} onClick={handleSearchDate}>Search</div>
      <div className="text1">Most Frequent Destinations</div>
      <div className="cards">
        {data
          .filter(item => item.v_type === "frequent" && item.availability > 0)
          .slice(0, 3)
          .map(item => (
            <Card
              key={item.id}
              location={item.location}
              price={item.price}
              availability={item.availability}
              discount={item.discount}
              vType={item.v_type}
              path={item.path}
              bestMonth={item.best_month}
              id={item.id}
            />
          ))
        }
      </div>
      <div id="topDeals" className="text2">
        Top Deals</div>
      <div className="cards">
        {data
          .filter(item => item.v_type === "top" && item.availability > 0)
          .slice(0, 3)
          .map(item => (
            <Card
              key={item.id}
              location={item.location}
              price={item.price}
              availability={item.availability}
              discount={item.discount}
              vType={item.v_type}
              path={item.path}
              bestMonth={item.best_month}
              id={item.id}
            />
          ))
        }
      </div>
      <div className="text1">Summer Vacations</div>
      <div className="cards">
        {data
          .filter(item => item.v_type === "summer" && item.availability > 0)
          .slice(0, 3)
          .map(item => (
            <Card
              key={item.id}
              location={item.location}
              price={item.price}
              availability={item.availability}
              discount={item.discount}
              vType={item.v_type}
              path={item.path}
              bestMonth={item.best_month}
              id={item.id}
            />
          ))
        }
      </div>
    </div>
  );
}

export default Destinations;