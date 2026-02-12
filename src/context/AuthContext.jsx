import { createContext, useState, useEffect } from "react";
import { api } from "../lib/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authTokens, setAuthTokens] = useState(() => {
    const raw = localStorage.getItem("authTokens");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (authTokens) {
      api
        .get("/me/")
        .then((res) => setUser(res.data))
        .catch(() => {
          setAuthTokens(null);
          localStorage.removeItem("authTokens");
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [authTokens]);

  const login = (tokens, userData) => {
    // tokens must be { access, refresh } from /api/login/
    setAuthTokens(tokens);
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    setUser(userData);
  };

  const logout = () => {
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authTokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
