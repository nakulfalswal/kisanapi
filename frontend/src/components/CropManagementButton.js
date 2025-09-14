import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import CropManagement from './CropManagement';
import './CropManagementButton.css';

const CropManagementButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className="crop-management-button"
        onClick={togglePanel}
        title="Crop Management System"
      >
        <Settings size={20} />
        <span>Crop Management</span>
      </button>

      <CropManagement 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        userData={null} // You can pass user data here
      />
    </>
  );
};

export default CropManagementButton;
