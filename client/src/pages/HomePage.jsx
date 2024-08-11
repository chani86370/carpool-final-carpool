import React, { useContext, useState } from 'react';
import {  Outlet, useLocation } from 'react-router-dom';
import { UserContext } from "../App.jsx";
import '../css/HomePage.css';
import Register from '../components/Register.jsx';
import Header from '../components/Header.jsx';
const HomePage = ({setUser}) => {
  const user = useContext(UserContext);
  const location = useLocation();
  const [showRegister, setShowRegister] = useState(false);
  const handlePopupToggle = () => {
    setShowRegister((prev) => !prev);
  }
  return (
    <div>
      <Header setUser={setUser} handlePopupToggle={handlePopupToggle}/>
      {showRegister && (<Register onClose={handlePopupToggle} setUser={setUser} />)}
      <Outlet />
    </div>
  )
};

export default HomePage;
