import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { request } from "../../shared/lib/apiClient";
import { storage } from "../../shared/lib/storage";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.user.get());

  useEffect(() => {
    storage.user.set(user);
  }, [user]);

  const signup = async (username, email, password) => {
    try {
      const data = await request("/api/user/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      if (!data.success) {
        return {
          success: false,
          message: data.message || "Unable to create your account",
        };
      }

      const sessionUser = {
        id: data.user?.id,
        username: data.user?.username,
        email: data.user?.email,
        role: data.user?.role,
        token: data.bearerToken,
      };

      storage.token.set(data.bearerToken);
      setUser(sessionUser);

      return {
        success: true,
        user: sessionUser,
        message: data.message || "User registered successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Unable to create your account",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await request("/api/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!data.success) {
        return {
          success: false,
          message: data.message || "Invalid email or password",
        };
      }

      const sessionUser = {
        id: data.user?.id,
        username: data.user?.username,
        email: data.user?.email,
        role: data.user?.role,
        token: data.bearerToken,
      };

      storage.token.set(data.bearerToken);
      setUser(sessionUser);

      return {
        success: true,
        user: sessionUser,
        message: data.message || "Logged in successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Invalid email or password",
      };
    }
  };

  const logout = () => {
    storage.token.remove();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      signup,
      login,
      logout,
    }),
    [user]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
