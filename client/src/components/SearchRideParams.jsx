import React,{useState} from 'react'
import Rides from './Rides'

const SearchRideParams = ({handleSearch ,showRides,handleSearchWithWalkingDistance}) => {
    const [date,setDate]=useState();
    const [rides, setRides] = useState([]);
    const [walkingTime, setWalkingTime] = useState(0);

    return (
        <>
            <div className='dateBtnSearch'>
                <input type='date' className='sinput input' value={date} name="date" placeholder="תאריך נסיעה" onChange={(e)=>setDate(e.target.value)} /><br />
                <button className="searchRideBtn" onClick={()=>handleSearch(date,setRides)}>Search</button><br />
            </div>
            {showRides && <Rides rides={rides} />}
            {showRides && !rides.length && (
                <div>
                    <input
                        type='number'
                        className='sinput input'
                        value={walkingTime}
                        name="walkingTime"
                        placeholder="How many minutes are you ready to walk?"
                        onChange={(e)=>{setWalkingTime(e.target.value)}}
                    /><br />
                    <button className="searchRideBtn" onClick={()=>handleSearchWithWalkingDistance(date,walkingTime,setRides)}>Search again</button><br />
                </div>
            )}
        </>
    )
}

export default SearchRideParams