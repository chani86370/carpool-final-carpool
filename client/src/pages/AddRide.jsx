import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from "../App.jsx";
import LocationSuggestions from "../components/LocationSuggestions";
import emailjs from 'emailjs-com';
import '../css/Search.css';
import AddRideDetails from "../components/AddRideDetails.jsx";

const AddRide = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [addRideError, setAddRideError] = useState('');
    const { rideIdParam } = useParams();
    const [rideInfo, setRideInfo] = useState({
        driverID: user.userID,
        passengers: 0,
        seats: 0,
        birthDate: user.birthDate,
        source: { name: "", lat: 0.0, lon: 0.0 },
        destination: { name: "", lat: 0.0, lon: 0.0 },
        price: 0.0,
        date: "",
        time: "",
        driverRemark: "",
        likes: 0,
        dislikes: 0,
        stops: []
    });

    async function serverGetRide(rideIdParam) {
        try {
            const response = await fetch(`http://localhost:3000/rides/edit/${rideIdParam}`, {
                credentials: "include"
            });
            const data = await response.json();
            if (response.status !== 200) {
                setAddRideError(data.message);
                return null;
            }
            return data; 
        } catch (error) {
            setAddRideError(error.toString());
            console.error('There was an error!', error);
            return null;
        }
    }
    
    useEffect(() => {
        async function fetchData() {
            if (rideIdParam) {
                const ride = await serverGetRide(rideIdParam);
                setRideInfo({
                    driverID: ride[0].userID,
                    passengers: ride[0].passengers,
                    seats: ride[0].seats,
                    birthDate: ride[0].birthDate,
                    source: { name: ride[0].source, lat: ride[0].sourceLat, lon: ride[0].sourceLon },
                    destination: { name: ride[0].destination, lat: ride[0].destinationLat, lon: ride[0].destinationLon },
                    price: ride[0].price,
                    date: new Date(ride[0].date).toISOString().split('T')[0],
                    time: ride[0].time,
                    driverRemark: ride[0].driverRemark,
                    likes: 0,
                    dislikes: 0,
                    stops: ride[0].stops
                });
            }
        }
        fetchData();
    }, [rideIdParam]);

    const handleAddRide = (e,rideDetails,setRideDetails) => {
        e.preventDefault();
        if (!rideDetails.date || !rideDetails.price || !rideDetails.seats || !rideInfo.destination || !rideInfo.source || !rideDetails.time) {//||!time
            setAddRideError('Please fill in all fields.');
            return;
        }
        const ride={
            passengers: rideDetails.passengers,
            seats: rideDetails.seats,
            birthDate: user.birthDate,
            source: { ...rideInfo.source },
            destination: { ...rideInfo.destination },
            price: rideDetails.price,
            date: rideDetails.date,
            time: rideDetails.time,
            driverRemark: rideDetails.driverRemark,
            likes: 0,
            dislikes: 0,
            stops: rideInfo.stops
        };
            fetch('http://localhost:3000/rides', {
            method: 'POST',
            credentials: "include", 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ride, driverID: user.userID, birthDate: user.birthDate })
        })
            .then(response => {
                return response.json()
                    .then(data => {
                        if (response.status !== 201) {
                            setAddRideError(data.message);
                        }
                        else {
                            setRideInfo({
                                driverID: user.userID,
                                passengers: 0,
                                seats: 0,
                                birthDate: user.birthDate,
                                source: { name: "", lat: 0.0, lon: 0.0 },
                                destination: { name: "", lat: 0.0, lon: 0.0 },
                                price: 0.0,
                                date: "",
                                time: "",
                                driverRemark: "",
                                likes: 0,
                                dislikes: 0,
                                stops: []
                            });
                            setRideDetails({...rideInfo});
                            setAddRideError("Your ride Added successfully to application")
                        }

                    })
            })
            .catch(err => setAddRideError('An error occurred during adding a ride. ' + err));
    };

    const handleUpdaeRide = (e,rideDetails) => {
        e.preventDefault();
        if (!rideDetails.date || !rideDetails.price || !rideDetails.seats || !rideInfo.destination || !rideInfo.source || !rideDetails.time) {//||!time
            setAddRideError('Please fill in all fields.');
            return;
        }
        const ride={
            driverID: user.userID,
            passengers: rideDetails.passengers,
            seats: rideDetails.seats,
            birthDate: user.birthDate,
            source: { ...rideInfo.source },
            destination: { ...rideInfo.destination },
            price: rideDetails.price,
            date: rideDetails.date,
            time: rideDetails.time,
            driverRemark: rideDetails.driverRemark,
            likes: 0,
            dislikes: 0,
            stops: { ...rideInfo.stops }
        };
        fetch(`http://localhost:3000/rides/${rideIdParam}`, {
            method: 'PUT',
            credentials: "include", 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ride, rideID: rideIdParam })
        }).then(response => {
            return response.json()
                .then(data => {
                    alert(response.status)
                    if (response.status !== 200) {
                        setAddRideError(data.message);
                    } else {
                        sendEmailToPassengers();                     
                        setAddRideError("Your ride had been updated successfully to the application")
                        navigate(`/homePage/travelsDetails`);
                    }
                })
        })
            .catch(err => setAddRideError('An error occurred during saving in ride. ' + err));
    }

    const sendEmailToPassengers = () => {
        fetch(`http://localhost:3000/users/emails/${rideIdParam}`,{ credentials: "include" })
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        setAddRideError(response.message);
                        return;
                    } else {
                        data.forEach(element => {
                            sendAnEmail(element.email, element.firstName)
                        });
                    }
                });
            })
            .catch((error) => {
                setAddRideError('There was an error!', error);
            });
    }

    const sendAnEmail = (email, name) => {
        const templateParams = {
            to_email: email,
            message: `Dear ${name},\n\n
            We wanted to inform you that your scheduled carpool trip on ${new Date(rideInfo.date).toLocaleDateString()} at ${rideInfo.time} from  ${rideInfo.source.name} to ${rideInfo.destination.name} has been changed by the driver.\n 
            To view the changes, you must enter your personal area.
            We apologize for any inconvenience caused.`
        }
        emailjs.send(
            'service_7vdgzor',
            'template_17bsaai',
            templateParams,
            '-smQEZzJW4OLKNgra'
        )
            .then((response) => {
                setAddRideError('An email with the message has been successfully sent to the passengers!');
            }, (error) => {
                setAddRideError('Failed to send email:', error);
            });
    }

    return (

        <form className="formAddRide">
            <LocationSuggestions searchData={rideInfo} setSearchData={setRideInfo} state={"addRide"} />
            <div className="addRideDetails">
                <AddRideDetails rideInfo={rideInfo} handleUpdaeRide={handleUpdaeRide} handleAddRide={handleAddRide} rideIdParam={rideIdParam}/>
                {addRideError && <p className='error' style={{ color: "red" }}>{addRideError}</p>}
            </div>
        </form>

    );
}
export default AddRide
