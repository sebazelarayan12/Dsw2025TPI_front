/**
 * Maneja las llamadas a la API y captura errores de forma consistente
 * @param {Function} apiCall - Función async que realiza la llamada a la API
 * @returns {Promise<{data: any, error: any}>} - Objeto con data o error
 */
export const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    return { data: response.data, error: null };
  } catch (err) {
    const data = err.response?.data;
    let errorMessage = 'Error en la operación';

    // Mapeo de errores de contraseña de Identity a español
    const passwordErrors = {
      'PasswordTooShort': 'La contraseña debe tener al menos 8 caracteres',
      'PasswordRequiresNonAlphanumeric': 'La contraseña debe contener al menos un carácter especial',
      'PasswordRequiresDigit': 'La contraseña debe contener al menos un número',
      'PasswordRequiresLower': 'La contraseña debe contener al menos una minúscula',
      'PasswordRequiresUpper': 'La contraseña debe contener al menos una mayúscula',
      'PasswordMismatch': 'La contraseña actual es incorrecta',
    };

    // Si el backend devuelve un string directo
    if (typeof data === 'string') {
      errorMessage = data;
    }
    // Si el backend devuelve un array de errores con {code, description}
    else if (Array.isArray(data)) {
      errorMessage = data.map(e => {
        // Si es un error de contraseña, usar el mensaje en español
        if (e.code && passwordErrors[e.code]) {
          return passwordErrors[e.code];
        }
        return e.description || e.message || e;
      }).join(', ');
    }
    // Si el backend devuelve un objeto con errors (validaciones de ModelState)
    else if (data?.errors && typeof data.errors === 'object') {
      const firstErrorKey = Object.keys(data.errors)[0];
      const firstError = data.errors[firstErrorKey];
      if (Array.isArray(firstError)) {
        errorMessage = firstError[0];
      } else {
        errorMessage = firstError;
      }
    }
    // Si tiene un campo detail o title
    else if (data?.detail) {
      errorMessage = data.detail;
    }
    else if (data?.title && data.title !== "One or more validation errors occurred.") {
      errorMessage = data.title;
    }
    // Fallback al mensaje genérico del error
    else if (err.message) {
      errorMessage = err.message;
    }

    return { data: null, error: { message: errorMessage } };
  }
};
