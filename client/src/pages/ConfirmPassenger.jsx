import React, { useState, useContext } from 'react';
import { UserContext } from "../App";
import emailjs from 'emailjs-com';
import { useParams } from 'react-router-dom';

const ConfirmPassenger = () => {
    const user = useContext(UserContext);
    const [confirmError, setConfirmError] = useState('');
    const { requestId } = useParams();

    const handleYesNO = (state) => {
        if (!user?.userID) {
            setConfirmError("You have to log in first");
            return;
        }
        fetch(`http://localhost:3000/passengers/${requestId}`,{ 
            method: "PUT",
            credentials: "include",  
            headers: {
                'Content-Type': 'application/json'  // מציינים סוג התוכן הנשלח
            },
            body: JSON.stringify({ state: state })
        })
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        setConfirmError(data.message);
                        return;
                    }
                    sendEmailToPassenger(data.email,state,data.source,data.destination,data.date)
                })
            })
            .catch((error) => {
                setConfirmError(error.toString());
                console.error('There was an error!', error);
            });

    };

    const sendEmailToPassenger=(email,answer,source,destination,date)=>{
        const templateParams = {
            from_name: `${user.firstName} ${user.lastName}`,
            to_email: email,
            message: `we want to tell thats  ${user.firstName} ${user.lastName} ${answer} your ride 
             \nfrom  ${source} to ${destination} at ${new Date(date).toLocaleDateString()}.\n`,}
        emailjs.send(
            'service_7vdgzor',
            'template_17bsaai',
            templateParams,
            '-smQEZzJW4OLKNgra'
        )
        .then((response) => {
            setConfirmError('An email with the message has been successfully sent to the passenger!',);
        }, (error) => {
            setConfirmError('Failed to send email:', error);
        });

    }


    const handleNo=()=>{
        handleYesNO("unConfirmed");
    }
    const handleYes=()=>{
        handleYesNO("confirmed")
    }
return (
    <div>
        <h2> Are you want to confirm the passenger to your ride? </h2>
        <button className='btnConfirm' onClick={handleYes}>YES</button>
        <button className='btnCancel' onClick={handleNo}>NO</button>
        {confirmError && <p className="error" style={{ color: "red" }}>{confirmError}</p>}
    </div>
)
}

export default ConfirmPassenger