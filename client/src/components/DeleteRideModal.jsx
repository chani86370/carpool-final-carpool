import React, { useContext, useState } from 'react'
import emailjs from 'emailjs-com';

const DeleteRideModal = ({setOpenDeleteConfirm,ride}) => {
    const [deleteMasage, setDeleteMasage] = useState(false);


    const deleteRide=()=>{//לבדוק מה הסדר
        fetch(`http://localhost:3000/rides/${ride.rideID}`,{ credentials: "include", method:"DELETE"})
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        setDeleteMasage(response.message);
                        return;
                    } else {
                       sendEmailToPassengers();
                    }
                });
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };
  
   


    const sendEmailToPassengers =()=>{
        fetch(`http://localhost:3000/users/emails/${ride.rideID}`,{ credentials: "include"})
            .then(response => {
                return response.json().then(data => {
                    if (response.status !== 200) {
                        setDeleteMasage(response.message);
                        return;
                    } else {
                       data.forEach(element => {
                        sendAnEmail(element.email,element.firstName)
                       });
                    }
                });
            })
            .catch((error) => {
                setDeleteMasage('There was an error!', error);
            }); 
    }   


const sendAnEmail=(email,name)=>{
    const templateParams = {
        to_email: email,
        message: `Dear ${name},\n\n
            We regret to inform you that your scheduled carpool trip on ${new Date(ride.date).toLocaleDateString()} at ${ride.time} from  ${ride.source} to ${ride.destination} has been canceled by the driver.\n
            We apologize for any inconvenience caused. Please book another trip at your convenience.`,}
    emailjs.send(
        'service_7vdgzor',
        'template_17bsaai',
        templateParams,
        '-smQEZzJW4OLKNgra'
    )
    .then((response) => {
        setDeleteMasage('An email with the message has been successfully sent to the passengers!');
    }, (error) => {
        setDeleteMasage('Failed to send email:', error);
    });

}




  return (
     <div className="popup">
        <p>Are you sure you want to delete the ride?<br/>The ride for all its passengers will be deleted<br/>
        And the passengers will receive an email about the cancellation</p>
        <button className='btnConfirm' onClick={deleteRide}>Yes</button>
        <button className='btnCancel' onClick={() => setOpenDeleteConfirm(false)}>Cancel</button>
        {deleteMasage && <p className='error' style={{ color: "red" }}>{deleteMasage}</p>}
    </div>
  )
}

export default DeleteRideModal