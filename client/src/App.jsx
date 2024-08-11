import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { createContext, useState, useEffect } from 'react';
import SearchRide from './pages/SearchRide'
import UserDetails from './pages/UserDetails'
import './App.css'
import HomePage from "./pages/HomePage";
import AddRide from "./pages/AddRide";
import UserWallet from "./pages/UserWallet";
import Profile from "./pages/Profile";
import UserTravels from "./pages/UserTravels";
import ConfirmPassenger from "./pages/ConfirmPassenger";

export const UserContext = createContext(null);

function App() {

  const [user, setUser] = useState(
    {
      userID: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      picture: "",
      birthDate: "",
      gender: "Male"
    }
  );
  useEffect(() => {
    fetch(`http://localhost:3000/authentication`,{credentials: "include"})
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        console.error(response.message);
                        return;
                    } else {
                      setUser({...data , birthDate:  new Date(data.birthDate).toLocaleDateString('en-CA')});
                    }
                });
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
  }, []);


  return (
    <UserContext.Provider value={user}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Navigate to="/homePage/search" />} />
          <Route path="/homePage" element={<HomePage setUser={setUser} />} >
            <Route path="search" element={<SearchRide />} >
              <Route path="rides" element={<SearchRide />} >
                <Route path=":id" element={<SearchRide />} />
              </Route>
            </Route>
            <Route path="addRide" element={<AddRide />} />
            <Route path="editRide/:rideIdParam" element={<AddRide />} />
            <Route path="wallet" element={<UserWallet />}/>
            <Route path="travelsDetails" element={<UserTravels/>}/>
            <Route path="profile" element={<Profile setUser={setUser}/>}/>
            <Route path="confirm-passenger/:requestId" element={<ConfirmPassenger  />} />
          </Route>
          <Route path="/user-details" element={<UserDetails setUser={setUser} />} />
        </Routes>
      </BrowserRouter >
    </UserContext.Provider >)
}

export default App
