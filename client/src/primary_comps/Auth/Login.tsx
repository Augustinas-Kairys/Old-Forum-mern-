import React, { ChangeEvent, FormEvent, useState } from "react";
import gif from "../assets/policijagifas.gif";
import logo from "../assets/logo.png";
import FormInput from "./Forminput";
import { Link, useNavigate } from 'react-router-dom';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Notification from '../../components/Notification'; 
import "./styles.scss";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'danger' | 'info' } | null>(null); 
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const responseData = await response.json();
        const { token, userId } = responseData; 
        localStorage.setItem('token', token); 
        localStorage.setItem('userId', userId);
        console.log("Login successful");
        navigate('/');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setNotification({ message: errorData.message, type: 'danger' });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setNotification({ message: "Error logging in. Please try again later.", type: 'danger' });
    }
  };
  return (
    <>
      <section className="login vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img src={gif} alt="Login Forma" className="img-fluid gif" />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-white">
                      <form onSubmit={handleSubmit}>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <span className="h1 fw-bold mb-0">
                            <img src={logo} alt="logo" width="100" height="100" />
                          </span>
                        </div>
                        <h5 className="fw-normal mb-3 pb-0" style={{ letterSpacing: "1px" }}>Prisijungti</h5>
                        <FormInput
                          placeholder="El. paštas"
                          name="email"
                          type="email"
                          value={email}
                          handleChange={handleEmailChange}
                          icon={faEnvelope}
                          className="form-input"
                        />
                        <FormInput
                          placeholder="Slaptažodis"
                          name="password"
                          type="password"
                          value={password}
                          handleChange={handlePasswordChange}
                          icon={faLock}
                        />
                        <div className="pt-1 mb-4">
                          <button type="submit" className="btn btn-info" >Prisijungti</button>
                        </div>
                        <a className="small text-white" href="#!">Pamiršai slaptažodį?</a>
                        <p className="mb-5 pb-lg-2 small text-white" style={{ color: "#393f81" }}>Dar neturi paskyros? <Link className="forgot small" to="/Register">Registruotis</Link></p>
                      </form>
                      {notification && <Notification message={notification.message} type={notification.type} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
