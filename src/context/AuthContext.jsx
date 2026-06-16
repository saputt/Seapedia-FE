import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [userRoles, setUserRoles] = useState(() => {
    const stored = localStorage.getItem("userRoles");
    return stored ? JSON.parse(stored) : [];
  });
  const [activeRole, setActiveRole] = useState(() =>
    localStorage.getItem("activeRole")
  );

  const login = useCallback(({ token, user, roles, activeRole }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userRoles", JSON.stringify(roles));
    localStorage.setItem("activeRole", activeRole);
    setToken(token);
    setUser(user);
    setUserRoles(roles);
    setActiveRole(activeRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("activeRole");
    setToken(null);
    setUser(null);
    setUserRoles([]);
    setActiveRole(null);
  }, []);

  const switchRole = useCallback((role) => {
    localStorage.setItem("activeRole", role);
    setActiveRole(role);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, userRoles, activeRole, login, logout, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
