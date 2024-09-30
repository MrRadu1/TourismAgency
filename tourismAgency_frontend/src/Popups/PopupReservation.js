import React from 'react';
import './Popups.css';

const PopupReservation = ({ item, paramValueLeftDate, paramValueRightDate, setShowPopup }) => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('username');
  const leftDate = new Date(paramValueLeftDate);
  const rightDate = new Date(paramValueRightDate);
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in one day
  const nights = Math.round(Math.abs((rightDate - leftDate) / oneDay));

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleReservation = (destination_id, total_cost) => {
    const newReservation = {
      destination_id,
      reservation_date: getTodayDate(),
      start_date: paramValueLeftDate,
      end_date: paramValueRightDate,
      total_cost,
      user_username: user
    }
    try {
      const response = fetch(`http://127.0.0.1:5000/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': token
        },
        body: JSON.stringify(newReservation)
      });
    } catch (error) {
      console.log('Error during update:', error);
    }
    setShowPopup(false);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="form-container2">
          <div className="row">
            <div className="column">
              <label htmlFor="location1">Location:</label>
              <span className='input-admin'>{item.location}</span>
            </div>
            <div className="column">
              <label htmlFor="price1">Price:</label>
              <span className='input-admin'>{item.price * nights}</span>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <label htmlFor="vtype1">Nights:</label>
              <span className='input-admin'>{nights}</span>
            </div>
            <div className="column">
              <label htmlFor="path1">Dates:</label>
              <span className='input-admin'>{paramValueRightDate} - {paramValueLeftDate}</span>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <button className="submit-button5" type="submit" onClick={() => handleReservation(item.id, item.price * nights)}>Add Reservation</button>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <button className="submit-button5" type="submit" onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PopupReservation;