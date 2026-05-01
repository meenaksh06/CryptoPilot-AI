import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, profileOpen, setProfileOpen }}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-[#080808] text-white transition-colors duration-300">
          {children}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
