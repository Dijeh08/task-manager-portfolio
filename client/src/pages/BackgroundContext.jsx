// BackgroundContext.js
import React, { createContext, useState, useContext } from 'react';

const BackgroundContext = createContext();

// This component provides the background context to other components
export const BackgroundProvider = ({ children }) => {
  const [background, setBackground] = useState('white');  // Default background color

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};

// Custom hook to use background context
export const useBackground = () => {
  return useContext(BackgroundContext);
};
