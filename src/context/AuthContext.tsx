"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  const savedUser = localStorage.getItem("auth-user");
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("auth-user");
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const isLoading = false;

  const login = useCallback(async (email: string) => {
    const savedUsers = localStorage.getItem("registered-users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    const found = users.find((u: { email: string }) => u.email === email);

    if (found) {
      setUser(found);
      localStorage.setItem("auth-user", JSON.stringify(found));
    } else {
      throw new Error("User not found");
    }
  }, []);

  const register = useCallback(async (name: string, email: string) => {
    const savedUsers = localStorage.getItem("registered-users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    if (users.find((u: { email: string }) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
    };

    users.push(newUser);
    localStorage.setItem("registered-users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("auth-user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth-user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
