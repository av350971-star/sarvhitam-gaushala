import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";
import { DEMO_ADMIN_CREDENTIALS } from "../admin/authConfig.js";
import { loadFromStorage, saveToStorage } from "../utils/storage.js";

const AdminAuthContext = createContext(null);

const SESSION_KEY = "adminSession";
const TOKEN_KEY = "gaushala_admin:token";

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    loadFromStorage(SESSION_KEY, false)
  );
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify existing token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const res = await api.auth.me();
          if (res?.success) {
            setAdminUser(res.admin);
            setIsAuthenticated(true);
            saveToStorage(SESSION_KEY, true);
          }
        } catch {
          // Token expired or server offline - keep existing session if local
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = (email || "").trim().toLowerCase();

    // 1. Try real backend API
    try {
      const response = await api.auth.login(normalizedEmail, password);
      if (response && response.success) {
        localStorage.setItem(TOKEN_KEY, response.token);
        setAdminUser(response.admin);
        setIsAuthenticated(true);
        saveToStorage(SESSION_KEY, true);
        return { success: true };
      }
    } catch (apiError) {
      console.warn("Backend login failed or unreachable, checking demo fallback:", apiError.message);
      
      // If server returned specific bad credentials error
      if (apiError.status === 401 || apiError.status === 400) {
        // Still check fallback demo credentials in case backend is empty
        const isDemo =
          (normalizedEmail === DEMO_ADMIN_CREDENTIALS.email.toLowerCase() ||
            normalizedEmail === "sarvahitamsevasamiti@gmail.com") &&
          password === DEMO_ADMIN_CREDENTIALS.password;

        if (isDemo) {
          setIsAuthenticated(true);
          saveToStorage(SESSION_KEY, true);
          return { success: true };
        }

        return {
          success: false,
          message: apiError.message || "Invalid email या password। कृपया पुनः प्रयास करें।",
        };
      }
    }

    // 2. Demo fallback if backend is offline/connecting
    const isDemoValid =
      (normalizedEmail === DEMO_ADMIN_CREDENTIALS.email.toLowerCase() ||
        normalizedEmail === "sarvahitamsevasamiti@gmail.com") &&
      password === DEMO_ADMIN_CREDENTIALS.password;

    if (isDemoValid) {
      setIsAuthenticated(true);
      saveToStorage(SESSION_KEY, true);
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid email या password। कृपया पुनः प्रयास करें।",
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem(TOKEN_KEY);
    saveToStorage(SESSION_KEY, false);
  };

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated, adminUser, loading, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  }
  return ctx;
}
