import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Cập nhật user nếu localStorage thay đổi (đồng bộ giữa các tab hoặc sau đăng nhập)
  useEffect(() => {
    const syncUserFromStorage = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener('storage', syncUserFromStorage);
    return () => {
      window.removeEventListener('storage', syncUserFromStorage);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};