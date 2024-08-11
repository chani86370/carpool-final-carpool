import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../App"
import { useDropzone } from 'react-dropzone';


const UserDetails = ({ setUser }) => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [userDetailsError, setUserDetailsError] = useState('');
  const [preview, setPreview] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const path = queryParams.get('path');

  const handleGenderChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      gender: e.target.value
    }));
  }

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUser((prevUser) => ({
        ...prevUser,
        picture: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthDate") {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: new Date(value).toISOString().split('T')[0]
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value
      }));
    }
  }

  const putUser = () => {
    if (user.birthDate == "" || user.gender == "" || user.phone == "" || user.lastName == "" || user.firstName == "" || user.phone == "") {
      setUserDetailsError("Please fill in all fields.");
      return;
    }

    if (!validatePhone() || !isValidBirthDate(user.birthDate)) {
      return;
    }
    const formData = new FormData();
    formData.append('picture', user.picture);
    formData.append('user', JSON.stringify(user));

    const requestOptions = {
      method: 'PUT',
      credentials: "include",
      body: formData
    };

    fetch(`http://localhost:3000/users/${user.userID}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const userWithoutPassword = { ...data };
        delete userWithoutPassword.password;
        const perfectUser = { ...userWithoutPassword, birthDate: new Date(user.birthDate).toLocaleDateString() };
        setUser(perfectUser);
        navigate(path);
      })
      .catch(error => {
        setUserDetailsError(error.toString());
        console.error('There was an error!', error);
      });
  };

  const validatePhone = () => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    if ((user.phone).match(phoneNumberRegex)) {
      return true;
    }
    else {

      setUserDetailsError("You have entered an invalid phone number!");
      return false;
    }
  }

  function isValidBirthDate(birthDate) {
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthDate).getFullYear();
    const age = currentYear - birthYear;
    if (age < 10 || age > 120) {
      setUserDetailsError("Wrong age");
      return false;
    }
    return true;
  }

  return (
    <div className='registration'>
      <h2 className="title">User Details</h2><br />
      <input type="text" className='input' value={user.firstName} name="firstName" placeholder="firstName" onChange={handleChange} /><br />
      <input type="text" className='input' value={user.lastName} name="lastName" placeholder="lastName" onChange={handleChange} /><br />
      <input type="text" className='input' value={user.email} name="email" placeholder="email" disabled onChange={handleChange} /><br />
      <input type="text" className='input' value={user.phone} name="phone" placeholder="phone" onChange={handleChange} /><br />

      <select
        className='input'
        value={user.gender}
        onChange={(e) => handleGenderChange(e)}
      >
        <option>Choose a gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input type='date' className='input' value={user.birthDate} name="birthDate" placeholder="birth date" onChange={handleChange} /><br />
      <div {...getRootProps({ className: 'dropzone' })} style={{
        border: '2px dashed #cccccc', padding: '20px', cursor: 'pointer'
      }}>
        <input {...getInputProps()} />
        <p>Drag & drop a picture here, or click to select one</p>
      </div>

      {preview && (
        <div>
          <img className='picture' src={preview} alt="Preview" />
        </div>
      )}
      {userDetailsError && <p className='error' style={{ color: "red" }}>{userDetailsError}</p>}
      <button className="Connect" onClick={putUser}>Connect</button><br />
    </div>
  )
}

export default UserDetails;