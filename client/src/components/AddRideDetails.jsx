import React, { useEffect, useState } from 'react'
import '../css/Search.css';

const AddRideDetails = ({ rideInfo, handleUpdaeRide, handleAddRide, rideIdParam }) => {
  const [rideDetails, setRideDetails] = useState({ ...rideInfo });

  useEffect(() => {
   if(rideInfo!=null){
    setRideDetails({...rideInfo});
   }
  }, [rideInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRideDetails((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  }
  return (
    <>
      <p>Seats:</p>
      <input type="number" className='input' value={rideDetails.seats} name="seats" placeholder="enter seats" onChange={handleChange} step="1" min="1" /><br />
      <p>Price:</p>
      <input type="number" className='input' value={rideDetails.price} name="price" placeholder="enter price" onChange={handleChange} step="0.01" min="0.0" /><br />
      <p>Time:</p>
      <input type="time" className='input' value={rideDetails.time} name="time" onChange={handleChange}
      /><br />
      <p>Date:</p>
      <input type='date' className='input' value={new Date(rideDetails.date).toLocaleDateString('en-CA')} name="date" placeholder="enter date" onChange={handleChange} /><br />
      <input type="text" className='input' value={rideDetails.driverRemark} name="driverRemark" placeholder="enter driver Remark" onChange={handleChange} /><br />
      {rideIdParam == null ? <button className="Connect" onClick={(e) => handleAddRide(e, rideDetails, setRideDetails)}> Add Ride </button> :
        <button className="Connect" onClick={(e) => handleUpdaeRide(e, rideDetails)}> Save </button>}<br />
    </>
  )
}

export default AddRideDetails