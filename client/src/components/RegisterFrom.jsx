import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import {SERVER_URL} from '../config/config'
import {Alert} from 'react-bootstrap'
import NavBar from "../components/Navbar";
const validEmailRegex = RegExp(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [btnText, setBtnText] = useState('Sign Up');

    const RegisterUser = async (e) => {
        e.preventDefault();
        resetAlert()
        let valid = true;
        if(name == ""){
            valid = false;
            setAlertType('danger');
            setAlertMessage("Name is required");
        }
        if(email == ""){
            valid = false;
            setAlertType('danger');
            setAlertMessage("Email is required");
        }
        if(!validEmailRegex.test(email)){
            valid = false;
            setAlertType('danger');
            setAlertMessage("Please enter a valid email address");
        }
        
        if(password == ""){
            valid = false;
            setAlertType('danger');
            setAlertMessage("Password is required");
        }

        if(!(confPassword == password)){
            valid = false;
            setAlertType('danger');
            setAlertMessage("Password did not match");
        }

        if(valid){
            setBtnText('Loading');
            try {
                const response = await axios.post(SERVER_URL+'users/register', {
                    name: name,
                    email: email,
                    password: password,
                    confPassword: confPassword
                });
                //console.log('Register',response);
                if(response.status == 200){
                    setBtnText('Sign up');
                    const data = response.data;
                    if(data.success){
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfPassword('');
                        setAlertType('success');
                        setAlertMessage(data.message);
                    }
                    else{
                        setAlertType('danger');
                        setAlertMessage(data.message);
                    }
                    console.log('Register',response);
                }
                else{
                    setBtnText('Sign up');
                    setAlertType('danger');
                    setAlertMessage("Failed internal server error");
                }
                
            } catch (error) {
                setBtnText('Sign up');
                setAlertType('danger');
                setAlertMessage("Failed to connect to main server");
                
            }
        } 
    }

    const resetAlert = ()=>{
        setAlertType(false);
        setAlertMessage("");
    }

    return (
        <>
            <NavBar/>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={RegisterUser}>
                        <h3>Sign Up</h3>
                        {alertType && 
                            <Alert variant={alertType} className="no-border">
                                {alertMessage}
                            </Alert>
                        }
                        <div className="mb-3">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter name"
                                name="name"
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label>Email address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="cpassword"
                                className="form-control"
                                placeholder="Enter password"
                                value={confPassword} 
                                onChange={(e) => setConfPassword(e.target.value)}
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                {btnText}
                            </button>
                        </div>
                        <p className="forgot-password text-right">
                            Already registered  <Link to="/login">Signin?</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
export default RegisterForm;