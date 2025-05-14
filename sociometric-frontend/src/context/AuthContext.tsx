import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import ITeacher from '../types/teacher';
import IStudent from '../types/student';

interface AuthContextType {
  user: ITeacher|IStudent;
  token: string | null;
  role: string | null;
  login: (token: string, role?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ITeacher|IStudent | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      setUser(decoded as ITeacher | IStudent);
      setToken(storedToken);
      setRole("hash" in decoded ? 'student' : 'teacher');
    }
  }, []);

  const login = (token: string, role = 'teacher') => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    const decoded:ITeacher | IStudent = jwtDecode(token);
    setUser(decoded);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user:(user as ITeacher | IStudent), token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}