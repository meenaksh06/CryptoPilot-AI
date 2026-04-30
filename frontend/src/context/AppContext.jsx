import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, profileOpen, setProfileOpen }}>
      <div className={darkMode ? 'dark' : ''}>
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-[#f7f8fa] text-gray-900'}`}>
          {children}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
