'use client';

import { createContext, useContext } from 'react';

interface AuthContextType {
  userEmail: string | null;
}

export const AuthContext = createContext<AuthContextType>({ userEmail: null });

export function useAuthContext() {
  return useContext(AuthContext);
}
