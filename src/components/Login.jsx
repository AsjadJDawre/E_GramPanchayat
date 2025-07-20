import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../styles/Login.css';
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner"; 
import { useGuest } from "./context/GuestContext";
const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const{isGuest, setIsGuest} = useGuest();

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const checkAdmin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoading(true);
    // console.log(email, password);

    try {
      const resp = await axios.post(`${apiUrl}/api/login`, {
        email,
        password,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const res = resp.data;
      if (res.status === 200 && res.role === 'user') {
        setIsGuest(false);
        toast.success("User logged in successfully!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else if (res.status === 200 && res.role === 'admin') {
                setIsGuest(false);

        toast.success("Welcome Admin, logged in successfully!");
        setTimeout(() => navigate("/Admin"), 2000);
      } else if (res.status === 200 && res.role === 'staff') {
                setIsGuest(false);

        toast.success("Welcome Staff, logged in successfully!");
        setTimeout(() => navigate("/staff_dashboard"), 2000);
      }
    } catch (error) {
      if (error.response) {
        const { status, message } = error.response.data;
        if (status === 404) {
          toast.error("User does not exist!");
        } else if (status === 401) {
          toast.error("Invalid credentials! Please check your email and password.");
        } else {
          toast.error(message || "Login failed! Please try again.");
        }
      } else {
        // console.error(error);
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className='login_section'>
        <div
          className="form-box"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="form-value">
            <form onSubmit={checkAdmin}>
              <h2>Welcome Back</h2>
              <div className="inputbox">
                <input
                  type="text"
                  name="email"
                  id="text"
                  autoComplete='off'
                  required
                />
                <label>Email</label>
              </div>
              <div className="inputbox">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="password"
                  id="passwordInput"
                  required
                  autoComplete='off'
                />
                <i 
                  id="passwordToggle"
                  className={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                  onClick={handlePasswordToggle}
                ></i>
                <label htmlFor="passwordInput">Password</label>
              </div>
              <div className="forget">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <button 
                type="submit" 
                className="custom_submit_button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                ) : "Login"}
              </button>
              <div className="register">
                Don't have an account? <Link to="/register">Register</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default LoginForm;