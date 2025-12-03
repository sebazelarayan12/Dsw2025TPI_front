import { instance } from '../../shared/api/axiosInstance';
import { mapBackendError } from '../../shared/helpers/mapBackendError';

export const register = async (username, password, email, role, name) => {
  try {
    
    const response = await instance.post('api/auth/register', { 
      username, 
      password, 
      email, 
      role, 
      name: name || '' // Garantiza que siempre se envíe, aunque sea string vacío
    });
    return { data: response.data, error: null };
  } catch (err) {
    const mappedError = mapBackendError(err);
    return { data: null, error: mappedError };
  }
};