import React, { useState, useEffect, useContext } from "react";
import emailjs from 'emailjs-com';
import "../css/modal.css";
import { UserContext } from "../App.jsx";
import { AiFillLike, AiFillDislike } from "react-icons/ai";


const ModalRide = ({ closeModal, onSubmit, defaultValue }) => {
    const user = useContext(UserContext);
    const [fullRide, setFullRide] = useState(null);
    const [selectedStop, setSelectedStop] = useState(null); 
    const [error, setError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    async function serverGetRide() {
        const ride = await fetch(`http://localhost:3000/rides/${defaultValue}`,{ credentials: "include"})
            .then(async response => await response.json());
        return { ...ride };
    };

    useEffect(() => {
        async function fetchData() {
            const ride = await serverGetRide();
            setFullRide(ride[0]);
        }
        fetchData();
    }, [defaultValue]);

    const handleSelectedStopsChange = (e) => {
        setSelectedStop(e.target.value); 
        setError(""); 
    };

    const handleContinueWithoutStop = () => {
        onSubmit(fullRide.source);
       setSelectedStop(true);
       setError("");
    };

    const createRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/requests`, {
                credentials: "include", 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: user.userID,
                    rideID: fullRide.rideID,
                    stopID: JSON.parse(selectedStop)?.stopID // מפרשים את מחרוזת ה-JSON כאן
                })
            });

            const data = await response.json();
            if (response.status !== 200) {
                setConfirmError(data.message);
                setError(data.message)
                return null;
            }
            return data.insertId;
        } catch (error) {
            setConfirmError(error.toString());
            console.error('There was an error!', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (selectedStop||!fullRide.stops.length>0) {
            const requestId = await createRequest();
            if (requestId) {
                const stop = JSON.parse(selectedStop); 
                const templateParams = {
                    from_name: `${user.firstName} ${user.lastName}`,
                    to_email: fullRide.email,
                    message: `${user.firstName} ${user.lastName} wants to travel with you \n
                      on your ride from ${fullRide.source} to ${fullRide.destination} at ${new Date(fullRide.date).toLocaleDateString()}\n
                      in station ${stop?.name||fullRide.source}.`,
                    requestId: requestId.toString()
                };

                emailjs.send(
                    'service_7vdgzor',
                    'template_ww2a0cd',
                    templateParams,
                    '-smQEZzJW4OLKNgra'
                )
                    .then((response) => {
                    }, (error) => {
                        console.error('Failed to send email:', error);
                    });

                onSubmit(stop);  
                closeModal();
            } else {
            }
        } else {
            setError("You didn't choose a station, are you sure you want to continue?");
        }
    };

    return (
        <div
            className="modal-container"
            onClick={(e) => {
                if (e.target.className === "modal-container")
                    closeModal();
            }}
        >
            <div className="modal">
                <form>
                    {fullRide && <div className='ride'>
                        <h2>Ride Details:</h2>
                        <p>Source: {fullRide.source}</p>
                        <p>Destination: {fullRide.destination}</p>
                        <p>Date: {new Date(fullRide.date).toLocaleDateString('en-CA')}</p>
                        <p>Time: {fullRide.time}</p>
                        <p>No. of seats available: {fullRide.seats - fullRide.passengers}</p>
                        <p>Price: {fullRide.price}</p>
                        <p>Driver Remark: {fullRide.driverRemark}</p>
                        <h2>Driver Details:</h2>
                        <p>Name: {fullRide.firstName} {fullRide.lastName}</p>
                        <p>Age: {new Date().getFullYear() - new Date(fullRide.birthDate).getFullYear()}</p>
                        <p>Gender: {fullRide.gender}</p>
                        <span className="spanLikesModal"> 
                            <AiFillLike /><p>{fullRide.likes||0}</p>
                            <AiFillDislike /><p>{fullRide.dislikes||0}</p>
                        </span><br/>
                        <img className="picture" src={`http://localhost:3000/${fullRide.picture}`} alt="User Picture"  />
                        {fullRide.stops.length>0 &&<><h3>Choose a station:</h3>
                         <select
                            value={selectedStop}
                            onChange={handleSelectedStopsChange}
                            className="completeModal"
                        >
                            <option value="">Select a station</option>
                            {fullRide.stops.map((stop, index) => (
                                <option key={index} value={JSON.stringify({ stopID: stop.stopID, name: stop.stopLocation })}>{stop.stopLocation}</option>
                            ))}
                        </select></>}
                    </div>}
                    {error && (
                        <>
                            <div className="error">{error}</div>
                            <button type="button" className="close" onClick={handleContinueWithoutStop}>
                                YES
                            </button>
                        </>
                    )}
                    <button type="button" className="close" onClick={closeModal}>
                        Close
                    </button>
                    {user.userID &&<button type="submit" className="btn" onClick={handleSubmit}>
                        Register
                    </button>}
                </form>
            </div>
        </div>
    );
}

export default ModalRide;
