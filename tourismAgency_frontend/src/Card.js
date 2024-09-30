import React, { useState, useEffect } from 'react';
import PopupStatistics from './Popups/PopupStatistics';
import PopupReservation from './Popups/PopupReservation';
import PopupAdmin from './Popups/PopupAdmin';

function Card(props) {
  const { Search, location, price, availability, discount, vType, path, bestMonth, id } = props;
  const [item, setItem] = useState({
    location,
    price,
    availability,
    discount,
    v_type: vType,
    path,
    best_month: bestMonth,
    id
  });

  const [showPopup, setShowPopup] = useState(false);
  const token = sessionStorage.getItem('token');
  const urlParams = new URLSearchParams(window.location.search);
  const paramValueLeftDate = urlParams.get('leftDate');
  const paramValueRightDate = urlParams.get('rightDate');
  const [img, setImg] = useState();
  const user = sessionStorage.getItem('username');
  const isLogged = user !== null;
  const [showPopup2, setShowPopup2] = useState(false);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    import(`${item.path}`).then((image) => {
      setImg(image.default);
    });
  }, [item.path]);

  useEffect(() => {
    const endpointUrl = `http://127.0.0.1:5000/reservations/destination/${id}`;
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
    <div className={`${Search ? 'search-card' : 'card'}`}>
      <img src={img} alt="Large Image" className='imageStyle' onClick={() => setShowPopup(true)} />
      <div className="card-des" onClick={() => setShowPopup(true)}>
        <div className="location">
          <span>{item.location}</span>
          <span style={{ color: item.v_type === 'top' ? '#FE5050' : '#5E6282' }}>
            {item.discount !== 0 ?
              `${((100 - item.discount) * item.price) / 100}$/night` :
              `${item.price}$/night`}
          </span>
        </div>
        <div className="dates">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a282b37b28d5452e563e14f357bf1248deff93c5affa4b378dc5de6dd4fb89a4?apiKey=4b5273898c5f441d8c65b09150123dc7&" />
          <span>{item.best_month}</span>
          {item.v_type === 'top' && <span style={{ marginLeft: 'auto', marginRight: '2%', color: '#FE5050' }}>{item.discount}$ Discount</span>}
        </div>
      </div>

      {showPopup && window.location.pathname.includes('/user') && (
        <PopupAdmin
          item={item}
          setItem={setItem}
          setShowPopup={setShowPopup}
          setShowPopup2={setShowPopup2} />
      )}
      {showPopup && isLogged && window.location.pathname.includes('/destinationsSearch') && (paramValueLeftDate !== '' && paramValueRightDate !== '') && (
        <PopupReservation
          item={item}
          paramValueLeftDate={paramValueLeftDate}
          paramValueRightDate={paramValueRightDate}
          setShowPopup={setShowPopup}
        />
      )}
      {showPopup2 && reservations.length > 0 && (
        <PopupStatistics
          setShowPopup={setShowPopup}
          setShowPopup2={setShowPopup2}
          reservations={reservations}
        />
      )}
    </div>
  );
}

export default Card;
