import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../App.css';
import '../css/PopUp.css';
import { AiOutlineCloseSquare } from "react-icons/ai";

const Register = ({ onClose, setUser }) => {
    const [isLogIn, setIsLogIn] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");
    const [registerError, setRegisterError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleIsLogInClick = () => {
        setIsLogIn((prev) => !prev);
        setRegisterError("");
    };

    const handleLogin = () => {
        if (!email || !password) {
            setRegisterError('Please fill in all fields.');
            return;
        }
        if (!CheckPassword(password)||!ValidateEmail(email)) {
            return;
        }
        fetch('http://localhost:3000/logIn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        })
            .then(response => {
                return response.json()
                    .then(data => {
                        if (response.status !== 200) {
                            setRegisterError(data.message);
                        } else {
                            setUser(data);
                            onClose();
                        }
                    })
                    .catch(err => setRegisterError('An error occurred.' + err));
            })
    };

    const handleRegistration = () => {
        if (!email || !password || !passwordVerify) {
            setRegisterError('Please fill in all fields.');
            return;
        }
        if (password !== passwordVerify) {
            setRegisterError('The passwords are not the same.');
            return;
        }
        if (!CheckPassword(password)||!ValidateEmail(email)) {
            return;
        }

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ email, password })
        })
            .then(response => {
                return response.json()
                    .then(data => {
                        if (response.status !== 201) {
                            setRegisterError(data.message);
                        } else {
                            const user = {
                                userID: data,
                                firstName: "",
                                lastName: "",
                                email: email,
                                phone: "",
                                password: "",
                                picture: "",
                                birthDate: "",
                                gender: ""
                            };
                            setUser(user);
                            onClose();
                            navigate(`/user-details?path=${location.pathname}`);
                        }
                    })
            })
            .catch(err => setRegisterError('An error occurred during registration.' + err));
    };

    const CheckPassword = (password) => {
        const psw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
        if (password.match(psw)) {
            return true;
        } else {
            setRegisterError('Wrong password...! The password must contain letters and numbers');
            return false;
        }
    };

    const ValidateEmail = (email) => {
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if ((email).match(mailformat)) {
            return true;
        } else {
            setRegisterError("You have entered an invalid email address!");
            return false;
        }
    }

    return (
        <div className="popup">
            {isLogIn ? (
                <div className='registration'>
                    <AiOutlineCloseSquare onClick={onClose} />
                    <h2 className="title">Log in</h2><br />
                    <input type="text" className='input' value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} /><br />
                    <input type="password" className='input' value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} /><br />
                    <button className="btnOkLogIn" onClick={handleLogin}>Connect</button>
                    <Link className='link' onClick={handleIsLogInClick}>Don't have an account? Sign up</Link>
                </div>
            ) : (
                <div className='registration'>
                    <AiOutlineCloseSquare onClick={onClose}/>
                    <h2 className="title">Create Account</h2><br />
                    <input type="text" className='input' value={email} placeholder="email" onChange={(e) => setEmail(e.target.value)} /><br />
                    <input type="password" className='input' value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} /><br />
                    <input type="password" className='input' value={passwordVerify} placeholder="password-verify" onChange={(e) => setPasswordVerify(e.target.value)} /><br />
                    <button className="btnOkSignUp" onClick={handleRegistration}>Connect</button><br />
                    <Link className='link' onClick={handleIsLogInClick}>Already have an account? Sign in</Link>
                </div>
            )}
            {registerError && <p className='error' style={{ color: "red" }}>{registerError}</p>}
        </div>
    );
};

export default Register;
