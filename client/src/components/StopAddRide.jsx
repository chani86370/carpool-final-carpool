import React, { useState } from 'react';
import { debounce } from 'lodash';

const StopAddRide = ({ handleSuggestionClick, fetchStreets }) => {
  const [stopSelection, setStopSelection] = useState([]);
  const [stopsSuggestions, setStopsSuggestions] = useState([]);

  const fetchStreetSuggestions = debounce(async (query, setSuggestions) => {
    if (query.length > 1) {
      const streets = await fetchStreets(query);
      setSuggestions(streets);
    } else {
      setSuggestions([]);
    }
  }, 200);

  const handleStopSelectionChange = (e) => {
    setStopSelection(e.target.value);
    fetchStreetSuggestions(e.target.value, setStopsSuggestions);
  }
  return (
    <>     
     <input type="text" className='input searchInput' value={stopSelection} name="stop" placeholder="Enter Stop" onChange={handleStopSelectionChange} /><br />
      {stopsSuggestions.length > 0 && (
        <ul className="suggestions stopSuggestion">
          {stopsSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion, 'stops', setStopSelection, setStopsSuggestions)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default StopAddRide