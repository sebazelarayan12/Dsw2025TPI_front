const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error inesperado. Intente nuevamente.';

/**
 * Parsea errores de .NET API (ProblemDetails, excepciones o strings simples)
 */
const mapBackendError = (error) => {
  // 1. Si no hay respuesta del servidor (ej: red caída)
  if (!error.response) {
    return {
      message: 'No se pudo conectar con el servidor.',
      isNetworkError: true
    };
  }

  const { data, status } = error.response;

  // 2. Caso: El backend devuelve un string directo (ej: return BadRequest("Error..."))
  if (typeof data === 'string') {
    return { message: data };
  }

  // 3. Caso: Excepciones de .NET (ProblemDetails estándar)
  // Suelen tener 'detail', 'title' o 'errors' (validacion de ModelState)
  
  // Prioridad A: Mensaje específico de validación (errors: { Campo: ["Error"] })
  if (data.errors && typeof data.errors === 'object') {
    // Tomamos el primer error de validación que encontremos
    const firstErrorKey = Object.keys(data.errors)[0];
    const firstErrorMessage = data.errors[firstErrorKey]?.[0];
    if (firstErrorMessage) {
      return { message: firstErrorMessage };
    }
  }

  // Prioridad B: Campo 'detail' (común en excepciones manejadas)
  if (data.detail) {
    return { message: data.detail };
  }

  // Prioridad C: Campo 'title' (ej: "One or more validation errors occurred.")
  if (data.title) {
    // A veces el title es muy genérico, tratamos de evitarlo si es el de validación
    if (data.title !== "One or more validation errors occurred.") {
      return { message: data.title };
    }
  }

  // 4. Fallback por código de estado HTTP
  if (status === 401) return { message: 'No autorizado. Inicie sesión nuevamente.' };
  if (status === 403) return { message: 'No tiene permisos para realizar esta acción.' };
  if (status === 404) return { message: 'El recurso solicitado no existe.' };
  if (status === 500) return { message: 'Error interno del servidor.' };

  // 5. Default
  return { message: DEFAULT_ERROR_MESSAGE };
};

export { mapBackendError };