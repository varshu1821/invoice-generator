import React, { useRef, useState } from "react";
import axios from 'axios';
import "../login/login.css";


const Setting = () => {
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState(localStorage.getItem('cName'));
  const [imageUrl, setImageUrl] = useState(localStorage.getItem("photoURL"));
  const [isLoading, setLoading] = useState(false);



  //Handle file selection
  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const submitHandler = async (e) => {
    setLoading(true);
    try {

        // Create a new FormData object
     const formData = new FormData();
        formData.append('username', displayName);
        formData.append('photo', file); // Append the file here

        const userId = localStorage.getItem('userId')
        //call register api
        const response = await axios.put(`http://localhost:5000/api/auth/users/${userId}`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
                "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token if needed
            }
        });
        localStorage.setItem('cName',response.data.username)
        localStorage.setItem('photoURL', response.data.photoUrl)
        setLoading(false);
    } catch (error) {
        console.error("Error updating user:", error);
    } finally {
      window.location.reload();
    }
};

    


  return (
    <div>
      <p>Settings</p>
      <div className="setting-wrapper">
        <div className="profile-info update-cName">
          <img
            onClick={() => fileInputRef.current.click()}
            className="pro"
            alt="profile-pic"
            src={imageUrl}
          />
          <input
            onChange={onSelectFile}
            style={{ display: "none" }}
            type="file"
            ref={fileInputRef}
          />
        </div>
        <div className="update-cName">
          <input onChange={e=> {setDisplayName(e.target.value)}} type="text" placeholder="company Name" value={displayName}/>
          <button onClick={submitHandler}>
        {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin-pulse"></i> // Spinner icon
        ) : (
            "Update"
        )}
    </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
