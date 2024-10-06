import React, { useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"; // Modular Firebase imports
import { storage , auth,db} from "../../firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const Setting = () => {
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState(localStorage.getItem('cName'));
  const [imageUrl, setImageUrl] = useState(localStorage.getItem("photoURL"));

  const updateCompanyName = () =>{
    updateProfile(auth.currentUser,{
      displayName:displayName
    })
    .then(res =>{
      localStorage.setItem('cName',displayName)
      updateDoc(doc(db,"users",localStorage.getItem('uid')),{
        displayName:displayName
      })
      .then(res=>{
        window.location.reload()
      })
    })
  }

  const onSelectFile = (e) => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const updateLogo = () => {
    if (!file) return;

    const auth = getAuth(); // Get the auth instance
    const user = auth.currentUser; // Get the current user

    if (!user) {
      console.error("No user is currently signed in");
      return;
    }

    const fileRef = ref(storage, localStorage.getItem('photoURL'));
    console.log(fileRef._location.path_);
    const storageRef = ref(storage, fileRef._location.path_);
  
    uploadBytesResumable(storageRef, file)
    .then(() => {

      window.location.reload();
    })
    .catch(error => {
      console.error("Error: ", error); // Added error handling
    });
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
          { file && <button onClick={updateLogo} style={{width:'30%',padding:'10px', backgroundColor:'rgb(204, 71, 9)'}}>Update Profile Pic</button>}
        </div>
        <div className="update-cName">
          <input onChange={e=> {setDisplayName(e.target.value)}} type="text" placeholder="company Name" value={displayName}/>
          <button onClick={updateCompanyName}>Update Company Name</button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
