import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faTwitter, faGoogle, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import './assets/styles.scss';

const Footer: React.FC = () => {
  return (
    <div className="footer text-center text-white">
      <div className="container p-3">
        <section className="mb-3">
          <a className="btn btn-outline-light btn-floating m-2" href="#!" role="button">
          <FontAwesomeIcon icon={faFacebook as IconProp} />
          </a>
          <a className="btn btn-outline-light btn-floating m-2" href="#!" role="button">
            <FontAwesomeIcon icon={faTwitter as IconProp} />
          </a>
          <a className="btn btn-outline-light btn-floating m-2" href="#!" role="button">
            <FontAwesomeIcon icon={faGoogle as IconProp} />
          </a>
          <a className="btn btn-outline-light btn-floating m-2" href="#!" role="button">
            <FontAwesomeIcon icon={faInstagram as IconProp} />
          </a>
          <a className="btn btn-outline-light btn-floating m-2" href="https://discord.gg/esyKCVVc" role="button">
            <FontAwesomeIcon icon={faDiscord as IconProp} />
          </a>
        </section>
        <section className="m-5">
          <div className="row">
            <p className="text-center">
              Šioje svetainėje ir jos turinyje esančios visos teisės, įskaitant autorių teises, prekių ženklus, intelektinę nuosavybę, priklauso TowerRP.LT . Bet kokia svetainės, jos turinio ar jame pateiktos medžiagos naudojimo, kopijavimo, platintojimo ar kitokio atkūrimo, be raštiško sutikimo iš TowerRP komandos, yra griežtai draudžiama.
            </p>
          </div>
        </section>
        <div className="text-center p-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
          © 2024 Copyright:
          <a className="text-white" href="index.html">TowerRP.LT</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
