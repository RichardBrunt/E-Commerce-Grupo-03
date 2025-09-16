import React from "react";
import "../assets/Footer.css";
import { FaInstagram, FaFacebookF, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="ml-footer">
      <div className="ml-footer-content">
        <div className="ml-footer-section ml-footer-links">
          <h3>Atajos</h3>
          <ul>
            <li><a href="#">Categorías</a></li>
            <li><a href="#">Ofertas</a></li>
            <li><a href="#">Cupones</a></li>
            <li><a href="#">Ayuda</a></li>
            <li><a href="#">Mi cuenta</a></li>
            <li><a href="#">Carrito</a></li>
          </ul>
        </div>
        <div className="ml-footer-section ml-footer-contact">
          <h3>Contacto</h3>
          <ul>
            <li><FaMapMarkerAlt /> Av. Libertador 123, CABA</li>
            <li><FaPhoneAlt /> +54 11 1234-5678</li>
            <li><FaEnvelope /> contacto@uade.com</li>
          </ul>
        </div>
        <div className="ml-footer-section ml-footer-social">
          <h3>Seguinos</h3>
          <div className="ml-footer-social-icons">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>
      </div>
      <div className="ml-footer-bottom">
        © {new Date().getFullYear()} Apple Store · Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
