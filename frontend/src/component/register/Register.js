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
    
                // Create a new FormData object
             const formData = new FormData();
                formData.append('username', displayName);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('photo', file); // Append the file here

                //call register api
                const response = await axios.post('http://localhost:5000/api/auth/register',formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Important for file uploads
                    }
                });


                // Navigate to the dashboard after successful registration
                navigate('/dashboard');

                // Store user details in local storage
                localStorage.setItem('cName', displayName);
                localStorage.setItem('photoURL', response.data.photoUrl);
                localStorage.setItem('email', email);
                localStorage.setItem('loggedIn', true);

                 // Store user details and JWT token from the backend
            localStorage.setItem('token', response.data.token);

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
