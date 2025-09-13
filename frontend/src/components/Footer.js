import React from 'react';
import { Heart, Github, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <p>
              Made with <Heart className="heart-icon" /> for farmers worldwide
            </p>
          </div>
          <div className="footer-right">
            <div className="social-links">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="GitHub"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
            <p className="copyright">
              © 2024 CropAI. All rights reserved.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="disclaimer">
            This tool provides recommendations based on machine learning analysis. 
            Please consult with agricultural experts for specific farming decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
