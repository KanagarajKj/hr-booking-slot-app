import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setHrMembers, setSelecetedHR, setEvents } from '../redux/slices/teams';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const hrDetails = [
  {
    hrName: 'Person A',
    hrId: '01',
    hrProfilePic:
      'data:image/jpeg;base64,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',
    companyName: 'Tech Pvt Ltd',
  },
  {
    hrName: 'Person B',
    hrId: '02',
    hrProfilePic:
      'data:image/jpeg;base64,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',
    companyName: 'Tech Pvt Ltd',
  },
  {
    hrName: 'Person C',
    hrId: '03',
    hrProfilePic:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTjeSZW_x-yCrKA47-_SY7dU79r8dXOlKKpg&usqp=CAU',
    companyName: 'Tech Pvt Ltd',
  },
  {
    hrName: 'Person D',
    hrId: '04',
    hrProfilePic:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwbUoAmbGQUnvAcx3DZ2Tqqpdz3fQ3HP_6CQ&usqp=CAU',
    companyName: 'Tech Pvt Ltd',
  },
  {
    hrName: 'Person E',
    hrId: '05',
    hrProfilePic:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiTc0o3qGSSr5nE9_zQqKynWrpsTEDdemMBA&usqp=CAU',
    companyName: 'Tech Pvt Ltd',
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (hrDetails?.length > 0) {
      dispatch(setHrMembers(hrDetails));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hrDetails?.length]);

  const saveDetails = (props) => {
    dispatch(
      setSelecetedHR({
        hrId: props?.hrId,
        hrName: props?.hrName,
        hrProfilePic: props?.hrProfilePic,
        companyName: props?.companyName,
      })
    );
    navigate(`/calendars/${props?.hrId}`, { replace: true });
  };

  const getEvents = async () => {
    return axios
      .get('http://localhost:3003/get_event')
      .then((response) => {
        dispatch(setEvents(response?.data));
      })
      .catch((error) => console.log(error, 'errrr'));
  };

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <div className='text-center mt-5'>
      <h3>Booking Calendar App</h3>
    </div>
      <div className="cards">
        {hrDetails?.length > 0 &&
          hrDetails.map((person) => (
            <div className="card" style={{ width: '15rem' }} key={person?.hrId}>
              <img
                src={person?.hrProfilePic}
                className="card-img-top"
                alt="Profile Pic"
                style={{ width: '15rem', height: '10rem' }}
              />
              <div className="card-body">
                <h5 className="card-title">{person?.hrName}</h5>
                <p className="card-text">{person?.companyName}</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    saveDetails({
                      hrId: person?.hrId,
                      hrName: person?.hrName,
                      hrProfilePic: person?.hrProfilePic,
                      companyName: person?.companyName,
                    })
                  }
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Home;
