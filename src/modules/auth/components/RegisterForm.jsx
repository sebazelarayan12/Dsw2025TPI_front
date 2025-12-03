import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hooks/useAuth';
// Ya no necesitamos SweetAlert aquí

function RegisterForm({ onSuccess, fixedRole }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  
  // 1. NUEVO: Estado para el mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const onValid = async ({ username, password, email, name }) => {
    setErrorMessage('');
    setErrorMessages([]);
    setSuccessMessage(''); // Limpiamos mensajes previos
    
    const finalRole = 'User';

    try {
      const { error } = await registerUser(username, password, email, finalRole, name);

      if (error) {
        const detailedMessages = (error.errors || [])
          .map((err) => frontendErrorMessage[err.code] || err.message)
          .filter(Boolean);

        setErrorMessages(detailedMessages);
        setErrorMessage(
          error.frontendErrorMessage
          || detailedMessages[0]
          || error.backendMessage
          || 'No se pudo completar el registro',
        );
        return;
      }

      // --- CAMBIO IMPORTANTE AQUÍ ---
      // 2. Mostramos mensaje de éxito y esperamos 2 segundos antes de cerrar
      setSuccessMessage('¡Usuario registrado con éxito!');

      setTimeout(() => {
        if (onSuccess) {
            onSuccess(); // Cierra el modal (pop-up)
        } else {
            navigate('/login'); // O cambia de página
        }
      }, 2000); // 2000 milisegundos = 2 segundos de espera

    } catch (err) {
      const backendError = err.backendError;
      if (backendError) {
        const detailedMessages = (backendError.errors || [])
          .map((e) => frontendErrorMessage[e.code] || e.message)
          .filter(Boolean);

        setErrorMessages(detailedMessages);
        setErrorMessage(
          backendError.frontendErrorMessage
          || detailedMessages[0]
          || backendError.backendMessage
          || 'Llame a soporte',
        );
        return;
      }
      setErrorMessage('Llame a soporte');
    }
  };

  return (
    <form
      className="
        flex flex-col gap-2 sm:gap-4
        bg-white
        p-4 sm:p-6
        pt-6 sm:pt-8
        rounded-xl
        shadow-lg
        w-full
        max-w-sm
        mx-auto
        my-4 sm:my-8
      "
      autoComplete='off'
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2 sm:mb-4">
        Crear Cuenta
      </h2>

      <Input
        label="Usuario"
        {...register('username', { required: 'Usuario es obligatorio' })}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        {...register('email', { required: 'Email es obligatorio' })}
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        type="password"
        {...register('password', { required: 'Contraseña obligatoria' })}
        error={errors.password?.message}
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        {...register('confirmPassword', {
          required: 'Confirmación obligatoria',
          validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
      />

      <Input
        label="Nombre"
        {...register('name', { required: 'El nombre es obligatorio' })}
        error={errors.name?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm sm:text-base font-medium text-gray-600">Rol</label>
        <select
          className="border rounded-lg p-2 sm:p-3 text-base sm:text-lg text-gray-700 bg-gray-100 cursor-not-allowed"
          disabled
          value="Usuario"
        >
          <option value="Usuario">Usuario</option>
        </select>
      </div>

      {/* 3. AQUÍ SE MUESTRA EL MENSAJE DE ÉXITO EN VERDE */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center">
            <strong className="font-bold">{successMessage}</strong>
        </div>
      )}

      {errorMessage && (
        <p className="text-red-500 text-center text-sm">{errorMessage}</p>
      )}
      {errorMessages.length > 0 && (
        <ul className="text-red-500 text-sm list-disc list-inside space-y-1">
          {errorMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}

      {/* Botón principal */}
      <Button type="submit">Registrarse</Button>

      {/* Botón volver */}
      {!onSuccess && (
        <Button type="button" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </Button>
      )}

    </form>
  );
}

export default RegisterForm;