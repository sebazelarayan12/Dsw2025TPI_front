import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hooks/useAuth';

function LoginForm({ onSuccess }) {
  // Simplificamos el estado de error a un solo string, 
  // ya que el helper mapBackendError nos da el mensaje procesado.
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  
  const { signin } = useAuth();

  const onValid = async (formData) => {
    setGlobalError('');
    
    try {
      //mapBackendError, 'error' ya trae { message: "..." }
      const { error } = await signin(formData.username, formData.password);

      if (error) {
        // 2. CORRECCIÓN: Leemos directamente el mensaje procesado
        setGlobalError(error.message || 'Ocurrió un error inesperado');
        return;
      }

      // Éxito
      if (onSuccess) {
        onSuccess();
      } else {
        // 3. Navegación al Dashboard
        navigate('/admin'); 
      }

    } catch (err) {
      // Catch de seguridad por si explota algo fuera del servicio
      setGlobalError('Error crítico en la aplicación.');
      console.error(err);
    }
  };

  return (
    <form
      className="
        flex flex-col gap-6
        bg-white
        p-8
        rounded-xl
        shadow-lg
        w-full
        max-w-md
        mx-auto
      "
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Bienvenido</h2>

      {/* Usuario */}
      <Input
        label="Usuario"
        {...register('username', { required: 'El usuario es obligatorio' })}
        error={errors.username?.message}
      />

      {/* Contraseña */}
      <Input
        label="Contraseña"
        type="password"
        {...register('password', { required: 'La contraseña es obligatoria' })}
        error={errors.password?.message}
      />

      {/* Mensaje de Error del Backend */}
      {globalError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200 text-center">
          {globalError}
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col gap-3 mt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
        </Button>

        {/* Solo mostrar el de registrar si NO es modal (o según tu diseño) */}
        {!onSuccess && (
          <Button
            type="button"
            onClick={() => navigate('/register')} // Asegurate que esta ruta exista en App.jsx
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 mt-2"
          >
            Registrarse
          </Button>
        )}
      </div>
    </form>
  );
}

export default LoginForm;