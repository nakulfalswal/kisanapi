import React from 'react';
import { Leaf, Brain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';
import LanguageSelector from './LanguageSelector';
import UserAccount from './UserAccount';
import './Header.css';

const Header = ({ onOpenCropDashboard }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Leaf className="logo-icon" />
            <h1>{t.appTitle}</h1>
          </div>
          
          <div className="header-center">
            <div className="empty-space"></div>
          </div>
          
          <div className="header-right">
            <div className="tagline">
              <Brain className="brain-icon" />
              <span>{t.appSubtitle}</span>
            </div>
            <LanguageSelector />
            <UserAccount onOpenCropDashboard={onOpenCropDashboard} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
