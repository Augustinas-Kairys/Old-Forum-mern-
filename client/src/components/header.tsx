import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHome, faShoppingBag, faDownload, faArchive, faUser, faSignOutAlt, faUserCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons'; 
import logo from "./assets/logo.png";
import './assets/styles.scss';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/Login');
  };

  const token = localStorage.getItem('token');

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark p-3">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbaras"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbaras">
            <img className="mx-5" src={logo} alt="LogoTipas" />
            <Link to="/" className="nav-link link-secondary mx-5">
                <FontAwesomeIcon icon={faHome as IconProp} /> HOME
            </Link>
            <a className="nav-link link-secondary mx-5" href="/">
              <FontAwesomeIcon icon={faShoppingBag as IconProp}/> Produktai
            </a>
            <a className="nav-link link-secondary mx-5" href="https://fivem.net">
              <FontAwesomeIcon icon={faDownload as IconProp} /> Atsisiųsti
            </a>
            <Link to="/Forum" className="nav-link link-secondary mx-5">
              <FontAwesomeIcon icon={faArchive as IconProp} /> Forumas
            </Link>
            <a
              className="nav-link link-secondary mx-5 dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faUserCircle as IconProp} /> Tower RP
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item link-secondary" href="#">Darbai</a></li>
              <li><a className="dropdown-item link-secondary" href="#">Apie mus</a></li>
              <li><a className="dropdown-item link-secondary" href="#">Kontaktai</a></li>
              <li><a className="dropdown-item link-secondary" href="/admin">Admin Panel</a></li>
            </ul>
          </div>
          {token ? (
            <>
              <Link to="/Profile" className="nav-link link-secondary mx-5">
                <FontAwesomeIcon icon={faUser} /> Profilis
              </Link>
              <button onClick={handleLogout} className="nav-link link-secondary mx-5">
                <FontAwesomeIcon icon={faSignOutAlt} /> Atsijungti
              </button>
            </>
          ) : (
            <Link to="/Login" className="nav-link link-secondary mx-5">
              <FontAwesomeIcon icon={faUserPlus} /> Prisijungti
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
