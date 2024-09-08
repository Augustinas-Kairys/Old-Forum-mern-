import React, { useState } from 'react';
import gif from "../assets/policijagifas.gif";
import logo from "../assets/logo.png";
import FormInput from "./Forminput"; 
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification'; 
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './styles.scss'; 

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const navigate = useNavigate(); 

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation
    if (username.length < 8) {
      setNotification({ message: "Vartotojo vardas turi būti bent 8 simbolių ilgio.", type: 'danger' });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setNotification({ message: "Prašome įvesti galiojantį elektroninio pašto adresą.", type: 'danger' });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return false;
    }
  
    if (password.length < 8) {
      setNotification({ message: "Slaptažodis turi būti bent 8 simbolių ilgio.", type: 'danger' });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return false;
    }
    

    const newUser = {
      username,
      email,
      password
    };

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        console.log('User registered successfully');
        setNotification({ message: 'Vartotojas sėkmingai registruotas', type: 'success' });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
        navigate('/Login');
      } else {
        console.error('User registration failed');
        setNotification({ message: 'Naudotojo registracija nepavyko', type: 'danger' });
        setTimeout(() => {
          setNotification(null); 
        }, 3000);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setNotification({ message: 'Klaidų registravimas vartotojas', type: 'danger' });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
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
                        <span className="h1 fw-bold mb-0"><img src={logo} alt="logo" width="100" height="100" /></span>
                      </div>
                      <h5 className="fw-normal mb-3 pb-0" style={{ letterSpacing: "1px" }}>Registruotis</h5>
                      <FormInput
                        placeholder="Slapyvardis"
                        name="username"
                        type="text"
                        value={username}
                        handleChange={handleUsernameChange}
                        icon={faUser}
                      />
                      <FormInput
                        placeholder="El. paštas"
                        name="email"
                        type="email"
                        value={email}
                        handleChange={handleEmailChange}
                        icon={faEnvelope}
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
                      <button type="submit" className="btn btn-info" >Registruotis</button>
                      </div>
                      <p className="mb-5 pb-lg-2 small text-white" style={{ color: "#393f81" }}>Jau turi paskyra? <a href="/login" style={{ color: "#4DF0A4" }}>Prisijunkti</a></p>
                    </form>
                    {notification && <Notification message={notification.message} type={notification.type} />} {/* Render Notification component if notification exists */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
