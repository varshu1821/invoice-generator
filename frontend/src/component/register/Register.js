    import React, { useState, useRef } from 'react';
    import '../login/login.css';
    import { Link, useNavigate } from 'react-router-dom';
    import { auth, storage, db } from '../../firebase';
    import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
    import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
    import { setDoc, doc } from 'firebase/firestore';
    import axios from 'axios'; // Use axios for backend API requests


    const Register = () => {
        const fileInputRef = useRef(null);
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [file, setFile] = useState(null);
        const [displayName, setDisplayName] = useState('');
        const [imageUrl, setImageUrl] = useState(null);
        const [isLoading, setLoading] = useState(false);

        const navigate = useNavigate();

        const onSelectFile = (e) => {
            setFile(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        };

        const submitHandler = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                // const newUser = await createUserWithEmailAndPassword(auth, email, password);

                const date = new Date().getTime();
                const storageRef = ref(storage, `${displayName + date}`);

                // Upload the file (logo) to Firebase Storage
                await uploadBytes(storageRef, file);
                const downloadedUrl = await getDownloadURL(storageRef);
                console.log(downloadedUrl);
                // Update the user's profile with displayName and photoURL
                // await updateProfile(newUser.user, {
                //     displayName: displayName,
                //     photoURL: downloadedUrl
                // });

                //call register api
                const response = await axios.post('http://localhost:5000/api/auth/register', {
                    username: displayName,
                    email,
                    password,
                    photoUrl: downloadedUrl, // Include the Firebase Storage URL
                });

                // Store user data in Firestore
                // await setDoc(doc(db, "users", newUser.user.uid), {
                //     uid: newUser.user.uid,
                //     displayName: displayName,
                //     email: email,
                //     photoURL: downloadedUrl
                // });

                // Navigate to the dashboard after successful registration
                navigate('/dashboard');

                // Store user details in local storage
                localStorage.setItem('cName', displayName);
                localStorage.setItem('photoURL', downloadedUrl);
                localStorage.setItem('email', email);
                localStorage.setItem('loggedIn', true);

                 // Store user details and JWT token from the backend
            const { token } = response.data;
            localStorage.setItem('token', token);

            } catch (error) {
                console.error("Error registering user:", error);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className='login-wrapper'>
                <div className='login-container'>
                    <div className='login-boxes login-left'></div>
                    <div className='login-boxes login-right'>
                        <h2 className='login-heading'>Create Your Account</h2>
                        <form onSubmit={submitHandler}>
                            <input
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className='login-input'
                                type='text'
                                placeholder='Email'
                            />
                            <input
                                required
                                onChange={(e) => setDisplayName(e.target.value)}
                                className='login-input'
                                type='text'
                                placeholder='Name'
                            />
                            <input
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className='login-input'
                                type='password'
                                placeholder='Password'
                            />
                            <input
                                required
                                onChange={(e) => onSelectFile(e)}
                                style={{ display: 'none' }}
                                className='login-input'
                                type='file'
                                ref={fileInputRef}
                            />
                            <input
                                required
                                className='login-input'
                                type='button'
                                value='Select your logo'
                                onClick={() => fileInputRef.current.click()}
                            />
                            {imageUrl != null && <img className='image-preview' src={imageUrl} alt='preview' />}
                            <button className='login-input login-btn' type='submit'>
                                {isLoading ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : 'Submit'}
                            </button>
                        </form>
                        <Link to='/login' className='register-link'>
                            Login With Your Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    export default Register;
