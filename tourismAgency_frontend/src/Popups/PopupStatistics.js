import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Popups.css';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

const PopupStatistics = ({ setShowPopup, setShowPopup2, reservations }) => {

  const [reservationsByMonth, setReservationsByMonth] = useState([]);
  const reservationColors = {};
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    countReservationsByMonth(reservations);
  }, [reservations]);

  const countReservationsByMonth = (reservations) => {
    const reservationsCount = new Array(12).fill(0);
    reservations.forEach((reservation) => {
      const monthIndex = new Date(reservation.start_date).getMonth();
      reservationsCount[monthIndex + 1]++;
    });
    setReservationsByMonth(reservationsCount);
  };

  const getRandomColor = (reservationId) => {
    console.log(reservationId);
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="form-container2">
          <div className="row">
            <div className="column" >
              <div className="calendar-container">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={({ date, view }) => {
                    if (view === 'month') {
                      let content = null;
                      reservations.forEach((reservation) => {
                        const reservationStartDate = new Date(reservation.start_date);
                        const reservationEndDate = new Date(reservation.end_date);
                        if (date >= reservationStartDate && date <= reservationEndDate) {
                          const reservationId = reservation.id; 
                          if (!reservationColors[reservationId]) {
                            reservationColors[reservationId] = getRandomColor(reservationId);
                          }
                          content = <div className="reservation-marker" style={{ backgroundColor: reservationColors[reservationId] }}></div>;
                        }
                      });
                      return content;
                    }
                    return null;
                  }}
                />
              </div>
            </div>
            <div className='column'>
              <VictoryChart
                width={600} // Set the width of the chart
                height={450} // Set the height of the chart
              >
                <VictoryAxis
                  tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                  tickFormat={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(x) => (`${x}`)}
                />
                <VictoryBar
                  data={reservationsByMonth}
                  x="month"
                  y="reservations"
                />
              </VictoryChart>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <button className="submit-button5" type="submit" onClick={() => { setShowPopup2(false); setShowPopup(false) }}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupStatistics;