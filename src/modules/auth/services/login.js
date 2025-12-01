import { instance } from '../../shared/api/axiosInstance';
import { mapBackendError } from '../../shared/helpers/mapBackendError';

export const login = async (username, password) => {
  try {
    // Recordá: quitamos el 'api/' porque ya está en la baseURL
    const response = await instance.post('api/auth/login', { username, password });

    return { data: response.data, error: null };
  } catch (err) {
    // Usamos el nuevo mapper que devuelve un objeto { message: "..." }
    const errorData = mapBackendError(err);
    
    // Retornamos el error formateado
    return { data: null, error: errorData };
  }
};