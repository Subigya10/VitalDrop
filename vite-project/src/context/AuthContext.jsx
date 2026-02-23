// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    return token ? { token, role } : null;
  });

  const login = (token, role) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);