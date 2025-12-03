import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Necesario para leer la identidad del token
import { login } from '../services/login';
import { register as registerService } from '../services/register';

const AuthContext = createContext();

function AuthProvider({ children }) {
  
  // 1. Inicializar estado del usuario desde localStorage
  // (Esto permite mantener los datos al recargar la página)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      // Validación extra para evitar el string "undefined" que se guardó antes por error
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error al leer usuario del storage", error);
      return null;
    }
  });

  // 2. Inicializar estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    // Aquí podrías agregar validación de expiración si quisieras más seguridad
    return Boolean(token);
  });

  // 3. Función de Inicio de Sesión (signIn)
  const signin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    try {
      const token = data.token;
      
      // PATRÓN IDENTITY: Decodificamos el token para obtener los Claims
      const decoded = jwtDecode(token);

      // Construimos el objeto de usuario basado en los datos del token
      const userData = {
        // 'sub' es el claim estándar para el username/identificador
        username: decoded.sub, 
        
        // 'id' es el claim personalizado que agregamos en el backend para el CustomerId
        customerId: decoded.id, 
        
        // Microsoft Identity usa esta URL larga para el claim de Rol
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'User'
      };

      // Guardamos el token y el usuario procesado
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Actualizamos el estado de la aplicación
      setUser(userData);
      setIsAuthenticated(true);

      return { error: null };

    } catch (e) {
      console.error("Error al procesar el token de identidad:", e);
      return { error: { frontendErrorMessage: "Error de seguridad al procesar credenciales." } };
    }
  };

  // 4. Función de Cerrar Sesión (signOut)
  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // 5. Función de Registro
  const register = async (username, password, email, role, name) => {
    const { error } = await registerService(username, password, email, role, name);
    return { error: error || null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signin,   // Exportamos con nombre corregido
        signout,  // Exportamos con nombre corregido
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