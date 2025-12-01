import { instance } from '../../shared/api/axiosInstance';
import { mapBackendError } from '../../shared/helpers/mapBackendError';

export const register = async (username, password, email, role) => {
  try {
    // CORRECCIÓN: Agregamos 'api/'
    const response = await instance.post('api/auth/register', { 
      username, password, email, role 
    });
    return { data: response.data, error: null };
  } catch (err) {
    const mappedError = mapBackendError(err);
    return { data: null, error: mappedError };
  }
};