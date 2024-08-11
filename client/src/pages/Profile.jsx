import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import "../css/Profile.css";
import { useDropzone } from 'react-dropzone';

const Profile = ({ setUser }) => {
  const user = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [preview, setPreview] = useState(null);


  useEffect(() => {
    setPreview(`http://localhost:3000/${user.picture}`);
  }, [user.picture])
  const onDrop = (acceptedFiles) => {
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
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleGenderChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      gender: e.target.value
    }));
  };

  const handleSave = () => {
    if (user.birthDate == "" || user.gender == "" || user.phone == "" || user.lastName == "" || user.firstName == "" || user.phone == "") {
      setUserDetailsError("Please fill in all fields.");
      return;
    }

    if (!validatePhone() || !ValidateEmail(user.email) ||!isValidBirthDate(user.birthDate)) {
      return;
    }

    const formData = new FormData();
    formData.append('picture', user.picture);
    formData.append('user', JSON.stringify(user));

    const requestOptions = {
      credentials: "include",
      method: 'PUT',
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
        setUser({ ...data, birthDate: new Date(data.birthDate).toLocaleDateString('en-CA') });
        setPreview(`http://localhost:3000/${data.picture}`); // update preview to the new image path
        setIsEditing(false);
      })
      .catch((error) => {
        setProfileError(error.toString());
        console.error('There was an error!', error);
      });
  };

  const validatePhone = () => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    if ((user.phone).match(phoneNumberRegex)) {
      return true;
    }
    else {
      setProfileError("You have entered an invalid phone number!");
      return false;
    }
  }

  const ValidateEmail = (email) => {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ((email).match(mailformat)) {
      return true;
    } else {
      setProfileError("You have entered an invalid email address!");
      return false;
    }
  }

  function isValidBirthDate(birthDate) {
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthDate).getFullYear();
    const age = currentYear - birthYear;
    if( age < 10 || age > 120){
        setProfileError("Wrong age");
    }
  }

  return (
    <div className="userDetails">
      {isEditing ? (
        <>
          <input type="text" className='input' value={user.firstName} name="firstName" placeholder="firstName" onChange={handleChange} /><br />
          <input type="text" className='input' value={user.lastName} name="lastName" placeholder="lastName" onChange={handleChange} /><br />
          <input type="text" className='input' value={user.email} name="email" placeholder="email" disabled onChange={handleChange} /><br />
          <input type="text" className='input' value={user.phone} name="phone" placeholder="phone" onChange={handleChange} /><br />

          <select
            className='input'
            value={user.gender}
            onChange={(e) => handleGenderChange(e)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type='date' className='input' value={new Date(user.birthDate).toISOString().split('T')[0]} name="birthDate" placeholder="birth date" onChange={handleChange} /><br />
          <div {...getRootProps({ className: 'dropzone' })}  style={{
            border: '2px dashed #cccccc', padding: '20px', cursor: 'pointer'
          }}>
            <input {...getInputProps()} />
            <p>Drag & drop a picture here, or click to select one</p>
          </div>

          {preview && (
            <div>
              <img className='picture' src={preview} alt="Preview"  />
            </div>
          )}
        </>
      ) : (
        <>
          {Object.entries(user).map(([key, value]) => (
            key !== 'userID' && key !== 'password' && key !== 'picture' && (
              <div className="info-row" key={key}>
                <span className="info-label">{key}:</span>
                <span className="info-value">{value}</span>
              </div>
            )
          ))}
          {user.picture && (
            <div>
              <img className='picture' src={preview} alt="User Picture"  />
            </div>
          )}
        </>
      )}

      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={toggleEditing}>Edit</button>
      )}
      {profileError && <p className='error' style={{ color: "red" }}>{profileError}</p>}
    </div>
  );
};

export default Profile;
