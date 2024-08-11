import React from 'react'
import Ride from '../components/Ride.jsx';

const Rides = ({rides}) => {

    return (
        <div className='rides'>
            {rides.length!=0 ? rides.map((ride) => (
                (
                    <Ride key={ride.rideID} ride={ride} />
                )
            )): <p>No suitable ride found<br/>How many minutes are you ready to walk?</p>}
        </div>
    )
}

export default Rides