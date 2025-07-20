import React, { createContext, useContext, useState } from 'react';

// Create the context
const GuestContext = createContext();

// Create the provider component
export const GuestProvider = ({ children }) => {
  const [isGuest, setIsGuest] = useState(true); // Default: true = guest mode

  return (
    <GuestContext.Provider value={{ isGuest, setIsGuest }}>
      {children}
    </GuestContext.Provider>
  );
};

// Custom hook for easy access
export const useGuest = () => useContext(GuestContext);
