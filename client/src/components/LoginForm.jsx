import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import {SERVER_URL} from '../config/config'
import {Alert} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/Navbar";

const validEmailRegex = RegExp(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [btnText, setBtnText] = useState('Sign in');
    const navigate = useNavigate();

    const LoginUser = async (e) => {
        e.preventDefault();
        resetAlert()
        let valid = true;
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

        if(valid){
            setBtnText('Loading');
            try {
                await axios.post(SERVER_URL+'users/login', {
                    email: email,
                    password: password,
                });
                navigate("/profile");
                
            } catch (error) {
                setBtnText('Sign in');
                if (error.response) {
                    setAlertType('danger');
                    setAlertMessage(error.response.data.message);
                }
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
                    <form onSubmit={LoginUser}>
                        <h3>Sign In</h3>
                        {alertType && 
                            <Alert variant={alertType} className="no-border">
                                {alertMessage}
                            </Alert>
                        }
                        <div className="mb-3">
                            <label>Email address</label>
                            <input
                                type="email"
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
                                className="form-control"
                                placeholder="Enter password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                {btnText}
                            </button>
                        </div>
                        <p className="forgot-password text-right">
                            Not registered <Link to="/register">Signup?</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}
export default LoginForm;