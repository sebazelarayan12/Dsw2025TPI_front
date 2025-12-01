import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hooks/useAuth';

function RegisterForm({ onSuccess, fixedRole }) {
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const onValid = async (formData) => {
    setGlobalError('');
    
    // Si viene fixedRole (ej: "Client"), lo usamos. Si no, usamos lo del select.
    const roleToSend = fixedRole || formData.role || 'Client';

    try {
      const { error } = await registerUser(
        formData.username, 
        formData.password, 
        formData.email, 
        roleToSend
      );

      if (error) {
        // Leemos el mensaje simplificado del helper mapBackendError
        setGlobalError(error.message || 'No se pudo completar el registro');
        return;
      }

      // Éxito
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/login'); // O donde prefieras ir post-registro
      }

    } catch (err) {
      console.error(err);
      setGlobalError('Error inesperado al intentar registrarse.');
    }
  };

  return (
    <form
      className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto"
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Crear Cuenta</h2>

      {/* Usuario */}
      <Input
        label="Usuario"
        {...register('username', { required: 'El usuario es obligatorio' })}
        error={errors.username?.message}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        {...register('email', { 
          required: 'El email es obligatorio',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Formato de email inválido'
          }
        })}
        error={errors.email?.message}
      />

      {/* Contraseña */}
      <Input
        label="Contraseña"
        type="password"
        {...register('password', { 
          required: 'La contraseña es obligatoria',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' }
        })}
        error={errors.password?.message}
      />

      {/* Confirmar Contraseña */}
      <Input
        label="Confirmar Contraseña"
        type="password"
        {...register('confirmPassword', {
          required: 'Confirma tu contraseña',
          validate: (val) => {
            if (!val) return true;
            return val === getValues('password') || 'Las contraseñas no coinciden';
          }
        })}
        error={errors.confirmPassword?.message}
      />

      {/* Selector de Rol (Solo si no está fijo) */}
      {!fixedRole && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Rol</label>
          <select
            className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            {...register('role', { required: 'El rol es obligatorio' })}
          >
            <option value="Client">Cliente</option>
            <option value="Admin">Administrador</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>
      )}

      {/* Mensaje de Error General */}
      {globalError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200 text-center">
          {globalError}
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col gap-3 mt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </Button>

        {!onSuccess && (
          <Button 
            type="button" 
            onClick={() => navigate('/login')}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 mt-2"
          >
            ¿Ya tienes cuenta? Iniciar Sesión
          </Button>
        )}
      </div>
    </form>
  );
}

export default RegisterForm;