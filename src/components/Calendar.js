import React, { useState, useMemo, useEffect } from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { useSelector } from 'react-redux';
// import '@fullcalendar/bootstrap/main.css';
import '../main.css';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import format from 'date-fns/format';

function Calendar() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const selectedHr = useSelector((state) => state.teamData.selectedHR);
  const newEvents = useSelector((state) => state.teamData.events);

  const findEvent = newEvents?.filter(
    (event) => event?.selectedHr?.hrId === selectedHr?.hrId
  );

  const getEvent = findEvent?.map((event) => {
    return {
      title: event?.fullName,
      start: event?.slotDateStart,
      end: event?.slotDateEnd,
    };
  });

  const disableFriday = (date) => {
    const day = date.getDay();
    return day === 5;
  };

  const disablePastTime = (date) => {
    const time = date?.getHours();
    const day = date.getDay();
    const currentTime = new Date();
    const timeNow = currentTime?.getHours();
    return time < timeNow && day === currentTime?.getDay();
  };

  function handleDateClick(date) {
    const hour = date?.date?.getHours();
    const minute = date?.date?.getMinutes();
    const second = date?.date?.getSeconds();
    if (disableFriday(date?.date)) {
      // disable selecting Friday
      alert('Friday is a Holiday');
      return false;
    } else if (hour > 0 && disablePastTime(date?.date)) {
      alert('Unable to Book Past Time');
      return false;
    } else if (hour === 0 && minute === 0 && second === 0) {
      const calendarApi = date.view.calendar;
      setSelectedDate(date?.dateStr);
      calendarApi.gotoDate(date.dateStr);
      calendarApi.changeView('timeGridDay');
    } else {
      setSelectedDate(date?.dateStr);
      setShowModal(true);
    }
  }

  const eventClick = ({ event, el }) => {
    // Add custom CSS class to the clicked date element
    el.classList.add('clicked-date');
    // Re-render the calendar with the new class applied
    event.view.calendar.updateSize();
  };

  useEffect(() => {
    if (Object.keys(selectedHr).length === 0) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(selectedHr).length]);

  return (
    <>
      <div className="calendar_div">
        <div className="card" style={{ width: '25rem', height: '27rem' }}>
          <img
            src={selectedHr?.hrProfilePic}
            className="card-img-top"
            alt="Profile Pic"
          />
          <div className="card-body">
            <h5 className="card-title">{selectedHr?.hrName}</h5>
            <p className="card-text">{selectedHr?.companyName}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary p-1"
            style={{ width: '7rem', margin: 'auto', marginBottom: '1rem' }}
          >
            Back
          </button>
        </div>
        <div className="cale_div">
          <Fullcalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              bootstrapPlugin,
            ]}
            initialView={'dayGridMonth'}
            headerToolbar={{
              start: 'today prev,next', // will normally be on the left. if RTL, will be on the right
              center: 'title',
              end: 'dayGridMonth,timeGridDay', // will normally be on the right. if RTL, will be on the left
            }}
            events={getEvent}
            className="my-custom-calendar"
            height={'60vh'}
            dateClick={handleDateClick}
            initialDate={selectedDate}
            eventClick={eventClick}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            slotDuration="00:60:00"
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            weekends={true}
            validRange={{
              start: new Date().toISOString(),
            }}
          />
        </div>
      </div>
      {findEvent?.length > 0 && (
        <>
          <div className="text-center">
            <h2>Booking Slot Details</h2>
          </div>
          <div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">SNo</th>
                  <th scope="col">Title | Name</th>
                  <th scope="col">Mobile Number</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                </tr>
              </thead>

              {findEvent?.map((event) => {
                const startDate = format(
                  new Date(event?.slotDateStart),
                  'dd/MM/yyyy hh.mmaaa'
                );

                const slotDateEnd = format(
                  new Date(event?.slotDateEnd),
                  'dd/MM/yyyy hh.mmaaa'
                );
                return (
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>{event?.fullName}</td>
                      <td>{event?.mobileNum}</td>
                      <td>{startDate}</td>
                      <td >{slotDateEnd}</td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </>
      )}
      {showModal && (
        <Modal
          onHide={() => setShowModal(false)}
          showModal={showModal}
          selectedHr={selectedHr}
          selectedDate={selectedDate}
        />
      )}
    </>
  );
}

export default Calendar;
