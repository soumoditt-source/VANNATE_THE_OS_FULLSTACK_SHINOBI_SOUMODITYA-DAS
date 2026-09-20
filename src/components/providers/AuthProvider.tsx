"use client";
import { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser { username: string; email?: string; }
interface AuthContextType { user: AuthUser | null; isLoading: boolean; }

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: false });
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // TODO: Replace with `getCurrentUser()` from 'aws-amplify/auth' once Cognito is configured
  const [user] = useState<AuthUser | null>(null);

  return (
    <AuthContext.Provider value={{ user, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

