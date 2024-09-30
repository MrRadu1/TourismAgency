import React, { useState } from 'react';
import './Popups.css';

const PopupAdmin = ({ item, setItem, setShowPopup, setShowPopup2 }) => {
  const token = sessionStorage.getItem('token');
  const [copy, setCopy] = useState(item);

  const updateCard = () => {
    const endpointUrl = `http://127.0.0.1:5000/destinations/${item.id}`;
    fetch(endpointUrl, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-tokens': token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setItem(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const handleSubmitUpdate = () => {
    try {
      const response = fetch(`http://127.0.0.1:5000/destinations/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': token
        },
        body: JSON.stringify(item)
      });
    } catch (error) {
      console.log('Error during update:', error);
    }
    setCopy(item);

  };

  const handleSubmitDelete = () => {
    try {
      const response = fetch(`http://127.0.0.1:5000/destinations/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': token
        },
      });
    } catch (error) {
      console.log('Error during update:', error);
    }
    window.location.reload(false);
    setShowPopup(false);
  };

  const handleShow = () => {
    console.log('close');
    updateCard();
    setItem(copy);
    setShowPopup(false);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="form-container2">
          <div className="row">
            <div className="column">
              <label htmlFor="location1">Location:</label>
              <input className='input-admin' type="text" id="location1" name="location1" defaultValue={item.location} onChange={(e) => item.location = e.target.value} />
            </div>
            <div className="column">
              <label htmlFor="price1">Price:</label>
              <input className='input-admin' type="text" id="price1" name="price1" defaultValue={item.price} onChange={(e) => item.price = e.target.value} />
            </div>
            <div className="column">
              <label htmlFor="availability1">Availability:</label>
              <input className='input-admin' type="text" id="availability1" name="availability1" defaultValue={item.availability} onChange={(e) => item.availability = e.target.value} />
            </div>
            <div className="column">
              <label htmlFor="discount1">Discount:</label>
              <input className='input-admin' type="text" id="discount1" name="discount1" defaultValue={item.discount} onChange={(e) => item.discount = e.target.value} />
            </div>
          </div>
          <div className="row">
            <div className="column">
              <label htmlFor="vtype1">V Type:</label>
              <input className='input-admin' type="text" id="vtype1" name="vtype1" defaultValue={item.v_type} onChange={(e) => item.v_type = e.target.value} />
            </div>
            <div className="column">
              <label htmlFor="path1">Path:</label>
              <input className='input-admin' type="text" id="path1" name="path1" defaultValue={item.path} onChange={(e) => item.path = e.target.value} />
            </div>
            <div className="column">
              <label htmlFor="bestmonth1">Best Month:</label>
              <input className='input-admin' type="text" id="bestmonth1" name="bestmonth1" defaultValue={item.best_month} onChange={(e) => item.best_month = e.target.value} />
            </div>
            <div className="column">
              <button className="submit-button4" type="submit" onClick={handleSubmitUpdate}>Update Destination</button>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <button className="submit-button3" type="submit" onClick={handleSubmitDelete}>Delete Destination</button>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <button className="submit-button5" type="submit" onClick={handleShow}>Close</button>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <button className="submit-button6" type="submit" onClick={() => { setShowPopup2(true); setShowPopup(false) }}>View Reservations and Statistics</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupAdmin;