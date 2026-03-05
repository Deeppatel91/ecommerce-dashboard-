import React, { createContext, useState, useContext, useEffect } from 'react';
import type { AuthContextType, User } from '../types/index';

// Export the context so custom hook useAuth.ts can import it
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionTimeout, setSessionTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const sessionStart = localStorage.getItem('sessionStart');

    if (savedUser && sessionStart) {
      const elapsed = Date.now() - parseInt(sessionStart);
      if (elapsed < SESSION_DURATION) {
        setUser(JSON.parse(savedUser));
        startSessionTimer(SESSION_DURATION - elapsed);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('sessionStart');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSessionTimer = (duration: number) => {
    if (sessionTimeout) clearTimeout(sessionTimeout);

    const timeout = setTimeout(() => {
      logout();
    }, duration);

    setSessionTimeout(timeout);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setSessionTimeRemaining(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('sessionStart', Date.now().toString());
      startSessionTimer(SESSION_DURATION);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u: User) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionStart');
    if (sessionTimeout) clearTimeout(sessionTimeout);
    setSessionTimeRemaining(null);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;

    const updated = { ...user, ...updatedUser };
    setUser(updated);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem('users', JSON.stringify(users));
    }

    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser, sessionTimeRemaining }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Keep inline hook for convenience (avoids breaking existing imports)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};