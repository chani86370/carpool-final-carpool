import { React, useContext, useState } from 'react'
import ModalRide from "../components/ModalRide";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../App.jsx"
import { FaCarSide } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import '../css/userTravels.css';
import DeleteRideModal from './DeleteRideModal.jsx';


const Ride = ({ ride, state = null }) => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [rideDetails, setRideDetails] = useState({ ...ride });
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);


    const handleRegisterToRide = () => {
        if (user.userID == "") {
            setMessage("You are not logged in, to continue you must log in/register.");
        }
        else {
            setMessage("Your request has been sent to the driver, you will receive a notification when approved");
        }
    }

    const handleEditTravel = () => {
        navigate(`/homePage/editRide/${ride.rideID}`);
    }

    const handleRegisterToTravel = () => {
        navigate(`/homePage/search/rides/${ride.rideID}`);
        setModalOpen(true);
    }

    const updateLikes = (like) => {
        if (like == 1) {
            setRideDetails(prevDetails => ({ ...prevDetails, likes: prevDetails.likes + 1 }));
        }
        else {
            setRideDetails(prevDetails => ({ ...prevDetails, dislikes: prevDetails.dislikes + 1 }));
        }
        const requestOptions = {
            credentials: "include",
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rideDetails)
        };
        fetch(`http://localhost:3000/rides/${ride.rideID}/likes`, requestOptions)
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        return;
                    }
                })
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    }

    const handleDelete = () => {
        setOpenDeleteConfirm(true);
    }

    return (
        <>
            <div className='singleRide'>
                {state == 'userTravels' && ((ride.driverID == user.userID && <span className='markDriverOrPassenger'><FaCarSide /></span>) || (<span className='markDriverOrPassenger'><MdAirlineSeatReclineNormal /></span>))}
                {ride.status && <p> <label className='label'>Status:</label> {ride.status}</p>}
                <p><label className='label'>Source:</label> {ride.source}</p>
                <p><label className='label'>Destination: </label>{ride.destination}</p>
                <p><label className='label'>Date: </label>{new Date(ride.date).toLocaleDateString()}</p>
                <p><label className='label'>Time:</label> {ride.time}</p>
                <p><label className='label'>No. of seats available: </label>{ride.seats - ride.passengers}</p>
                {ride.driverID != user.userID && <a className='link' onClick={() => { setModalOpen(true); }}>More Details</a>}
                {state != 'userTravels' ?
                    user.userID && <button className="connect" onClick={handleRegisterToTravel}>Register</button>
                    : (ride.driverID == user.userID ? ride.status == "Active" && <><button onClick={handleEditTravel}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                        <span className='spanLikes'>
                            <AiFillLike /><p>{ride.likes||0}</p>
                            <AiFillDislike /><p>{ride.dislikes||0}</p>
                        </span><br/>
                    </>
                        :<><span className='spanLikes'>
                            <AiFillLike onClick={() => updateLikes(1)} />
                            <AiFillDislike onClick={() => updateLikes(-1)} />
                        </span><br/>
                        </>
                    )
                }
            </div>
            {modalOpen && (
                <ModalRide
                    closeModal={() => {
                        navigate(state == null ? `/homePage/search` : `/homePage/travelsDetails`, { replace: true });
                        setModalOpen(false);
                    }}
                    onSubmit={handleRegisterToRide}
                    defaultValue={ride.rideID}
                    state={state}
                />
            )}
            {message && <p className='error' style={{ color: "red" }}>{message}</p>}
            {openDeleteConfirm && <DeleteRideModal setOpenDeleteConfirm={setOpenDeleteConfirm} ride={ride} />}

        </>
    )
}


export default Ride