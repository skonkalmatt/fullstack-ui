import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authTokens, setAuthTokens] = useState(() => {
    const raw = localStorage.getItem("authTokens");
    return raw ? JSON.parse(raw) : null;       // ← always an object {access, refresh}
  });

  useEffect(() => {
    if (authTokens) {
      // later: hit a /me/ endpoint; for now, placeholder
      setUser({ email: "demo@example.com" });
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
