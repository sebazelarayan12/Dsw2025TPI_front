import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className='
      flex
      flex-col
      justify-start
      items-center
      min-h-[100dvh]
      bg-neutral-100
      overflow-y-auto
      py-4
    '>
      <RegisterForm />
    </div>
  );
}
export default RegisterPage;