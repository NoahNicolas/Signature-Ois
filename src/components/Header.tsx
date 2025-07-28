
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mb-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/lovable-uploads/857e706e-565a-476f-96be-b6ff5855567b.png" 
            alt="Logo Les Oisillons de la roche"
            className="h-16 w-16 mr-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">
            Signature Ois
          </h1>
        </div>
        <p className="text-gray-600">
          Gestion des réunions et signatures - Les Oisillons de la roche
        </p>
      </div>
    </header>
  );
};

export default Header;
