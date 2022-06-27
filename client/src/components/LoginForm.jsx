import React from 'react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form>
                    <h3>Sign In</h3>
                    <div className="mb-3">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                    />
                    </div>
                    <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                    />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        Not registered <Link to="/forgotpassword">Signup?</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
export default LoginForm;