import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import '../css/Search.css';
import LocationSuggestions from '../components/LocationSuggestions.jsx';
import SearchRideParams from '../components/SearchRideParams.jsx';

const SearchRide = () => {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        source: {},
        destination: {},
        date: "",
        stops: [],
    });
    const [searchError, setSearchError] = useState('');
    const [showRides, setShowRides] = useState(false);

    const calculateDistance = (source, destination, ride) => {
        const sourceLatLng = L.latLng(source.lat, source.lon);
        const rideSourceLatLng = L.latLng(ride.source_lat, ride.source_lon);
        const destinationLatLng = L.latLng(destination.lat, destination.lon);
        const sourceDistance = sourceLatLng.distanceTo(rideSourceLatLng);
        const destinationDistance = destinationLatLng.distanceTo(L.latLng(ride.destination_lat, ride.destination_lon));
        return sourceDistance + destinationDistance;
    };

    const handleSearchWithWalkingDistance = (date, walkingTime, setRides) => {
        const { source, destination } = searchData;
        fetch(`http://localhost:3000/rides?date=${date}`, { credentials: "include" })
            .then(response => response.json())
            .then(data => {
                const filteredRides = data.filter(ride => {
                    const sumDistance = calculateDistance(source, destination, ride);
                    return sumDistance <= walkingTime * 83.3;
                });
                filteredRides.sort((a, b) => {
                    const distanceA = calculateDistance(source, destination, a);
                    const distanceB = calculateDistance(source, destination, b);
                    return distanceA - distanceB;
                });
                if (filteredRides.length === 0) {
                    setSearchError("No matching rides were found while walking");
                } else {
                    setRides(filteredRides);
                    setShowRides(true);
                    setSearchError("");
                    navigate("/homePage/search/rides");
                }
            })
            .catch(error => {
                setSearchError(error.toString());
                console.error('There was an error!', error);
            });
    };

    const handleSearch = (date, setRides) => {
        setSearchData({ ...searchData, date: date })
        if (searchData.source === "" || searchData.destination === "" || date === "") {
            setSearchError("Please fill all the fields");
            return;
        }
        fetch(`http://localhost:3000/rides?source=${searchData.source.name}&destination=${searchData.destination.name}&date=${date}`)
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        setSearchError(response.message);
                        return;
                    } else {
                        setRides(data);
                        setShowRides(true);
                        navigate("/homePage/search/rides");
                    }
                });
            })
            .catch((error) => {
                setSearchError(error.toString());
                console.error('There was an error!', error);
            });
    };

    return (
        <div className='container'>
            <div className='searchRide'>
                <LocationSuggestions searchData={searchData} setSearchData={setSearchData} />
                <SearchRideParams handleSearch={handleSearch} showRides={showRides} handleSearchWithWalkingDistance={handleSearchWithWalkingDistance} />
                {searchError && <p className='error'>{searchError}</p>}
            </div>
        </div>
    );
};

export default SearchRide;

