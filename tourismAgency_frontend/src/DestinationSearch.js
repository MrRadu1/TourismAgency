import Card from './Card';
import './Destinations.css';
import SearchBar from './SearchBar';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DestinationsSearch() {

  const [leftDate, setLeftDate] = useState("");
  const [rightDate, setRightDate] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [reservations, setReservations] = useState([]);
  const token = sessionStorage.getItem('token');
  const urlParams = new URLSearchParams(window.location.search);
  const paramValueLeftDate = urlParams.get('leftDate');
  const paramValueRightDate = urlParams.get('rightDate');
  const paramValueSearch = urlParams.get('search');

  const handleSearchDate = () => {
    if (!(leftDate === "" || rightDate === "")) {
      navigate(`/destinationsSearch?search=${paramValueSearch}&leftDate=${leftDate}&rightDate=${rightDate}`);
      window.location.reload();
    }
  }

  useEffect(() => {
    const endpointUrl = 'http://127.0.0.1:5000/destinations';
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

  useEffect(() => {
    const endpointUrl = 'http://127.0.0.1:5000/reservations';
    fetch(endpointUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-tokens': token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
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
      <div className="search-cards">
        {data
          .filter(item =>
            item.location.toLowerCase().includes(paramValueSearch.toLowerCase()) &&
            item.availability > 0 &&
            !reservations.some(reservation =>
              reservation.destination_id === item.id &&
              (new Date(reservation.end_date) >= new Date(paramValueLeftDate) || paramValueLeftDate === '') &&
              (new Date(reservation.start_date) <= new Date(paramValueRightDate) || !paramValueRightDate === '')
            )
          )
          .map(item => (
            <Card
              key={item.id}
              Search={true}
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

export default DestinationsSearch;