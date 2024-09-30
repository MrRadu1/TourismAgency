import Card from './Card';
import SearchBar from './SearchBar';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './Admin.css';
import { useNavigate } from 'react-router-dom';

function Admin() {

  const role = sessionStorage.getItem('role');
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [discount, setDiscount] = useState('');
  const [v_type, setVType] = useState('');
  const [path, setPath] = useState('');
  const [best_month, setBestMonth] = useState('');
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/')
    }
    const endpointUrl = `http://127.0.0.1:5000/destinations`;
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
  }, [refresh]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': token
        },
        body: JSON.stringify({ location, price, availability, discount, v_type, path, best_month })
      });
      setRefresh(!refresh);
    } catch (error) {
      console.log('Error during login:', error);
    }
  };

  return (
    <div className="content-container">
      <SearchBar backgroundColor="#857858" Position='relative' />
      <div className="form-container">
        <div className="row">
          <div className="column">
            <label htmlFor="location1">Location:</label>
            <input className='input-admin' type="text" id="location1" name="location1" onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="column">
            <label htmlFor="price1">Price:</label>
            <input className='input-admin' type="text" id="price1" name="price1" onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="column">
            <label htmlFor="availability1">Availability:</label>
            <input className='input-admin' type="text" id="availability1" name="availability1" onChange={(e) => setAvailability(e.target.value)} />
          </div>
          <div className="column">
            <label htmlFor="discount1">Discount:</label>
            <input className='input-admin' type="text" id="discount1" name="discount1" onChange={(e) => setDiscount(e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label htmlFor="vtype1">V Type:</label>
            <input className='input-admin' type="text" id="vtype1" name="vtype1" onChange={(e) => setVType(e.target.value)} />
          </div>
          <div className="column">
            <label htmlFor="path1">Path:</label>
            <input className='input-admin' type="text" id="path1" name="path1" onChange={(e) => setPath(e.target.value)} />
          </div>
          <div className="column">
            <label htmlFor="bestmonth1">Best Month:</label>
            <input className='input-admin' type="text" id="bestmonth1" name="bestmonth1" onChange={(e) => setBestMonth(e.target.value)} />
          </div>
          <div className="column">
            <button className="submit-button2" type="submit" onClick={handleSubmit}>Add Destination</button>
          </div>
        </div>
      </div>
      <div className="search-cards">
        {data
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

export default Admin;