import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { setHrMembers, setSelecetedHR, setEvents } from '../redux/slices/teams';
import { useDispatch } from 'react-redux';

const Modal = ({ showModal, onHide, selectedHr, selectedDate }) => {
  const [timeSlot, setTimeSlot] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(selectedHr).length === 0) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(selectedHr).length]);

  useEffect(() => {
    if (selectedDate) {
      const changeDateFormat = format(
        new Date(selectedDate),
        'dd/MM/yyyy  hh.mmaaa'
      );
      setTimeSlot(changeDateFormat);
    }
  }, [selectedDate]);

  console.log(selectedDate, 'selectedDate');
  const validate = (values) => {
    const errors = {};
    if (!values.fullName) {
      errors.fullName = 'Full Name is Required';
    } else if (values.fullName.length > 20) {
      errors.fullName = 'Must be 20 characters or less';
    } else if (values.fullName.length < 3) {
      errors.fullName = 'Must be 20 Characters or More';
    } else if (!/^[a-zA-Z ]*$/.test(values.fullName)) {
      errors.fullName = 'User Name Must be Letters Only';
    }

    if (!values.email) {
      errors.email = 'Email is Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid Email Address';
    }

    if (!values.mobileNum) {
      errors.mobileNum = 'Mobile Numer is Required';
    } else if (!/^[6-9]\d{9}$/.test(values.mobileNum)) {
      errors.mobileNum = 'Enter Valid Mobile Number';
    } else if (values.mobileNum.length > 10) {
      errors.mobileNum = 'Enter Valid Mobile Numbers';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      mobileNum: '',
      selectedHr: selectedHr,
      slotDate: timeSlot,
    },
    enableReinitialize: true,
    validate,
    onSubmit: (values) => {
      const startTime = selectedDate.slice(0, 19);
      const date = new Date(startTime);
      date.setHours(date.getHours() + 1);
      const endTime = date.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
      });
      const finalEndTime = endTime.slice(0, 19);
      const inputString = finalEndTime;
      const regex = /(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2})/;
      const match = inputString.match(regex);
      const year = match[3];
      const month = match[1].padStart(2, '0');
      const day = match[2].padStart(2, '0');
      const hour = match[4].padStart(2, '0');
      const minute = match[5].padStart(2, '0');
      const outputString = `${year}-${month}-${day}T${hour}:${minute}:00`;

      const newValue = {
        fullName: values?.fullName,
        email: values?.email,
        mobileNum: values?.mobileNum,
        selectedHr: values?.selectedHr,
        slotDateStart: startTime,
        slotDateEnd: outputString,
      };

      return axios
        .post('http://localhost:3003/addevent', newValue)
        .then((response) => {
          toast.success('Event Added Successfully');
          navigate('/');
          dispatch(setSelecetedHR({}));
          dispatch(setEvents([]));
          dispatch(setHrMembers([]));
          return response;
        })
        .catch((error) => console.log(error, 'errrr'));
    },
  });

  return (
    <div>
      <div
        className={
          !showModal
            ? 'modal fade custom-modal d-none m-2 m-md-0'
            : 'modal fade custom-modal  show d-block'
        }
      >
        <div className="modal-dialog">
          <div
            className="modal-content"
            style={{ height: '90vh', width: '500px', margin: 'auto' }}
          >
            <div className="text-center p-4">
              <h5>Book Your Slot</h5>
            </div>

            <div className="text-center">
              <img
                src={selectedHr?.hrProfilePic}
                alt="HR_Img"
                className="rounded-circle"
                style={{ width: '4rem', height: '4rem' }}
              />
              <h5>{selectedHr?.hrName}</h5>
            </div>

            <div>
              <form className="px-5" onSubmit={formik.handleSubmit}>
                <div class="mb-1">
                  <label for="fullName" className="form-label">
                    Title Name | Full Name
                  </label>
                  <input
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.fullName}
                  />
                </div>
                {formik.errors?.fullName ? (
                  <span className="formik-error-mes">
                    {formik.errors?.fullName}
                  </span>
                ) : null}
                <div class="mb-1">
                  <label for="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </div>
                {formik.errors?.email ? (
                  <span className="formik-error-mes">
                    {formik.errors?.email}
                  </span>
                ) : null}
                <div class="mb-1">
                  <label for="mobileNum" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="mobileNum"
                    name="mobileNum"
                    onChange={formik.handleChange}
                    value={formik.values.mobileNum}
                  />
                </div>
                {formik.errors?.mobileNum ? (
                  <span className="formik-error-mes">
                    {formik.errors?.mobileNum}
                  </span>
                ) : null}

                <div class="mb-1">
                  <label for="timeSlot" className="form-label">
                    Selected Date&Time
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="timeSlot"
                    name="timeSlot"
                    value={formik.values.slotDate}
                    disabled={true}
                  />
                </div>
                <div className="d-flex flex-row justify-content-center gap-5 mt-5">
                  <button type="submit" className="btn btn-primary mr-3">
                    Add Event
                  </button>
                  <button className="btn btn-primary ml-3" onClick={onHide}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
