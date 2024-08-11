import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import Ride from '../components/Ride';
import '../css/userTravels.css';

const UserTravels = () => {
    const user = useContext(UserContext);
    const [ridesArray, setRidesArray] = useState([]);
    const [allRidesArray, setAllRidesArray] = useState([]);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (user?.userID) {
            getMyRides(offset, true);
        }
    }, [user]);

    useEffect(() => {
        if (user?.userID && offset > 0) {
            getMyRides(offset, false);
        }
    }, [offset]);

    const getMyRides = (offset, isNewUser) => {
        fetch(`http://localhost:3000/rides/myRides/${user.userID}?limit=10&offset=${offset}`,{credentials: "include"})
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        console.error(response.message);
                        return;
                    } else {
                        if (isNewUser) {
                            setAllRidesArray(data);
                            setRidesArray(data);
                        } else {
                            setAllRidesArray(prevData => [...prevData, ...data]);
                            setRidesArray(prevData => [...prevData, ...data]);
                        }
                    }
                });
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const handleShowDriverRides = () => {
        setRidesArray(allRidesArray.filter((ride) => ride.driverID === user.userID));
    };

    const handleShowPassengerRides = () => {
        setRidesArray(allRidesArray.filter((ride) => ride.userID === user.userID));
    };

    const showAll = () => {
        setRidesArray(allRidesArray);
    };
    const showOnlyActive=()=>{
        setRidesArray(allRidesArray.filter((ride) => ride.status === "Active"));
    }

    const loadMore = () => {
        setOffset(prevOffset => prevOffset + 10); // שימי לב שהגדלתי ל-10 כי limit=10
    };

    const showNotApproved = () => {
        fetch(`http://localhost:3000/rides/myRides/${user.userID}/notApproved`,{ credentials: "include"})
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        console.error(response.message);
                        return;
                    } else {
                        setRidesArray(data);
                    }
                });
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    return (
        <>
         <div className='btnOptionFilterUserRides'>
                <button onClick={handleShowDriverRides}>show rides I'm the driver</button>
                <button onClick={handleShowPassengerRides}>show rides I'm the passenger</button>
                <button onClick={showNotApproved}>show not approved rides</button>
                <button onClick={showOnlyActive}>show only active rides</button>
                <button onClick={showAll}>show all rides</button>
            </div>
            <div className='userTravelsContainer'>
                {ridesArray.map((ride,index) => <Ride key={index} ride={ride} state={'userTravels'} />)}
            </div>
            { allRidesArray.length>=offset&&<button className='viewMore' onClick={loadMore}>view more</button>}
        </>
    );
};

export default UserTravels;
