import { useEffect, useState, useCallback } from "react";
import AuthContext from "./AuthContext";
import {
  apiPost,
  apiGet,
  setTokens,
  clearTokens,
  setStoredUser,
  getStoredUser,
  getAccessToken,
} from "../services/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAccessToken()));
  const [loading, setLoading] = useState(true);

  const syncFromStorage = useCallback(() => {
    const token = getAccessToken();
    const stored = getStoredUser();
    setIsAuthenticated(Boolean(token));
    setUser(stored);
  }, []);

  useEffect(() => {
    async function boot() {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await apiGet("/api/auth/me/");
        setUser(me);
        setStoredUser(me);
        setIsAuthenticated(true);
      } catch {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  async function login(username, password) {
    const data = await apiPost("/api/auth/login/", { username, password });
    setTokens(data.access, data.refresh);
    const u = data.user || (await apiGet("/api/auth/me/"));
    setStoredUser(u);
    setUser(u);
    setIsAuthenticated(true);
    return u;
  }

  async function register(payload) {
    await apiPost("/api/auth/register/", payload);
    // auto login after register
    return login(payload.username, payload.password);
  }

  function logout() {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  }

  const role = user?.role || null;
  const isMerchant = role === "MERCHANT" || role === "ADMIN";
  const isCustomer = role === "CUSTOMER" || role === "ADMIN";
  const isAdmin = role === "ADMIN";

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    role,
    isMerchant,
    isCustomer,
    isAdmin,
    syncFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
