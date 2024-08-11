import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App';
import { BsPersonCircle } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import "../css/modal.css";
import '../css/PopUp.css';
import "../css/nav.css";

const Header = ({ setUser, handlePopupToggle }) => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [openConfirmLogout, setOpenConfirmLogout] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const logOut = () => {
        fetch('http://localhost:3000/logout', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (response.ok) {
                    const userObject = {
                        userID: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        password: "",
                        picture: "",
                        age: "",
                        gender: "Male"
                    }
                    setUser({ ...userObject });
                    navigate('/');
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    }

    return (
        <>
            <nav className='header'>
                <div>
                    <BsPersonCircle className="svg" />
                    {(user.userID) ? <div className='userName' onClick={() => setMenuOpen(!menuOpen)}>{user.firstName} {user.lastName}</div> :
                        <Link onClick={handlePopupToggle}>Log In/Sign Up</Link>
                    }
                    {menuOpen && (
                        <div className="dropdown-menu">
                            <ul>
                                <li>
                                    <Link to="/homePage/profile" onClick={() => setMenuOpen(false)}>
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/homePage/travelsDetails" onClick={() => setMenuOpen(false)}>
                                        Travels Details
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/homePage/wallet" onClick={() => setMenuOpen(false)}>
                                        My Wallet
                                    </Link>
                                </li>
                                <li>
                                    <Link onClick={() => { setOpenConfirmLogout(true); setMenuOpen(false) }} >
                                    <CiLogout /> Log out     
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <Link to="/homePage/search"
                >
                    Search Ride
                </Link>

                <Link to={user.userID ? "/homePage/addRide" : "#"} onClick={!user.userID&&handlePopupToggle}
                >
                    Add Ride
                </Link>
                <img src='../pictures/carpool1.png'  />

            </nav>

            {openConfirmLogout && <div className="popup logOut">
                <p>Are you sure you want to log out?</p>
                <button className='btnConfirm' onClick={logOut}>Yes</button>
                <button className='btnCancel' onClick={() => setOpenConfirmLogout(false)}>Cancel</button>
            </div>}
        </>
    )
}

export default Header