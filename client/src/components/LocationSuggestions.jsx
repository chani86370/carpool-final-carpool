import React, { useState } from 'react';
import { debounce } from 'lodash';
import MapComponent from '../components/MapComponent.jsx';
import { IoLocationOutline } from "react-icons/io5";
import { BsFillTrashFill } from "react-icons/bs";

import '../css/Search.css';
import StopAddRide from './StopAddRide.jsx';

const LocationSuggestions = ({ searchData, setSearchData, state = null }) => {

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  
  const fetchStreetSuggestions = debounce(async (query, setSuggestions) => {
    if (query.length > 1) {
      const streets = await fetchStreets(query);
      setSuggestions(streets);
    } else {
      setSuggestions([]);
    }
  }, 200);

  const fetchStreets = async (query) => {
    try {
      const response = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&q=${query}&limit=10`);
      const data = await response.json();
      return data.result.records.map(record => `${record.שם_רחוב}, ${record.שם_ישוב}`);
    } catch (error) {
      console.error('Error fetching streets:', error);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'source') {
      setSearchData((prev) => ({
        ...prev,
        source: { ...prev.source, name: value }
      }));
      fetchStreetSuggestions(value, setSourceSuggestions);
    } else if (name === 'destination') {
      setSearchData((prev) => ({
        ...prev,
        destination: { ...prev.destination, name: value }
      }));
      fetchStreetSuggestions(value, setDestinationSuggestions);
    }
  };



  const fetchLocation = async (address) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
    const data = await response.json();
    if (data.length > 0) {
      return data[0];
    };
  }

  const handleSuggestionClick = async (suggestion, field,setStopSelection,setStopsSuggestions) => {
    const location = await fetchLocation(suggestion);
    if (field === 'source') {
      setSearchData((prev) => ({
        ...prev,
        source: { name: suggestion, lat: location.lat, lon: location.lon }
      }));
      setSourceSuggestions([]);
    } else if (field === 'destination') {
      setSearchData((prev) => ({
        ...prev,
        destination: { name: suggestion, lat: location.lat, lon: location.lon }
      }));
      setDestinationSuggestions([]);
    } else if (field === 'stops') {
      setStopsSuggestions([]);
      setStopSelection("");
      setSearchData((prevSearchData) => ({ ...prevSearchData, stops: [...prevSearchData.stops, { name: suggestion, lat: location.lat, lon: location.lon }] }));
    }
  };

  const handleRemoveStop = (removeIndex) => {
    setSearchData((prevSearchData) => ({
      ...prevSearchData,
      stops: prevSearchData.stops.filter((stop, index) => index !== removeIndex)
    }));
  }

  return (
    <>
      <div className='searchDataSourceDestination' >
        <div className='searchPartData'>
          <span className='signLocation'>< IoLocationOutline /></span>
          <input type="text" className='input searchInput' value={searchData.source.name} name="source" placeholder="Enter Source" onChange={handleChange} /><br />
          {sourceSuggestions.length > 0 && (
            <ul className="suggestions source">
              {sourceSuggestions.map((suggestion, index) => (
                <li className='suggestion' key={index} onClick={() => handleSuggestionClick(suggestion, 'source')}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <br />
        <div className='searchPartData'>
          <span className='signLocation'>< IoLocationOutline /></span>
          <input type="text" className='input searchInput' value={searchData.destination.name} name="destination" placeholder='Enter destination' onChange={handleChange} /><br />
          {destinationSuggestions.length > 0 && (
            <ul className="suggestions destination">
              {destinationSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion, 'destination')}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <br />
      </div>

      {state == "addRide" && <div className='inputStop'>
        <div className='searchPartData'>
          <StopAddRide handleSuggestionClick={handleSuggestionClick} fetchStreets={fetchStreets}/>
      </div>
     </div>}
      {searchData.stops && searchData.stops.length > 0 && (
        <div className='stopsDiv'>
          <h3 className='stopsLabel'>Stops:</h3>
          <ul className='selectedStops'>
            {(searchData.stops).map((stop, index) => (
              <li key={index}>
                  <BsFillTrashFill
                        className="deleteIcon"
                        onClick={() => handleRemoveStop(index)}
                />
                {stop.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <MapComponent sourceLocation={{ lat: searchData.source.lat, lon: searchData.source.lon }} destinationLocation={{ lat: searchData.destination.lat, lon: searchData.destination.lon }} stopsLocation={searchData.stops?.map(stop => ({ lat: stop.lat, lon: stop.lon }))} state={state} />
    </>
  )
}

export default LocationSuggestions