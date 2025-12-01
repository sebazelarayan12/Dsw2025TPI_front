import { createContext, useState } from 'react'; 
import { login } from '../services/login';
import { register as registerService } from '../services/register';

const AuthContext = createContext();

function AuthProvider({ children }) {
  // Estado de user y autenticación
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return Boolean(token);
  });

  const signin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    // Guardar token y user
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setUser(data.user);
    setIsAuthenticated(true);

    return { error: null };
  };

  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (username, password, email, role) => {
    const { error } = await registerService(username, password, email, role);
    return { error: error || null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signin,
        signout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export {
  AuthProvider,
  AuthContext,
};
