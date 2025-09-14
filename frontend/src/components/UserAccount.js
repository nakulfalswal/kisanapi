import React, { useState } from 'react';
import { User, LogIn, UserPlus, Settings, LogOut, Leaf } from 'lucide-react';
import './UserAccount.css';

const UserAccount = ({ onOpenCropDashboard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    // Mock login - in real app, this would connect to authentication service
    setIsLoggedIn(true);
    setUser({ name: 'Farmer User', email: 'farmer@example.com' });
    setIsOpen(false);
  };

  const handleSignup = () => {
    // Mock signup - in real app, this would connect to authentication service
    setIsLoggedIn(true);
    setUser({ name: 'New Farmer', email: 'newfarmer@example.com' });
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setIsOpen(false);
  };

  const handleMyCrop = () => {
    if (onOpenCropDashboard) {
      onOpenCropDashboard();
    }
    setIsOpen(false);
  };

  return (
    <div className="user-account">
      <button 
        className="user-account-button"
        onClick={() => setIsOpen(!isOpen)}
        title={isLoggedIn ? user?.name : "User Account"}
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div className="user-dropdown">
          {!isLoggedIn ? (
            <>
              <div className="user-dropdown-header">
                <User size={16} />
                <span>Account</span>
              </div>
              <div className="user-dropdown-content">
                <button 
                  className="user-option login"
                  onClick={handleLogin}
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
                <button 
                  className="user-option signup"
                  onClick={handleSignup}
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="user-dropdown-header">
                <User size={16} />
                <span>{user?.name}</span>
              </div>
              <div className="user-dropdown-content">
                <div className="user-info">
                  <div className="user-name">{user?.name}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
                <button 
                  className="user-option my-crop"
                  onClick={handleMyCrop}
                >
                  <Leaf size={16} />
                  <span>My Crop</span>
                </button>
                <button 
                  className="user-option"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button 
                  className="user-option logout"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {isOpen && (
        <div 
          className="user-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserAccount;
