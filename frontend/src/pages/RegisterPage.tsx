import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { InputField } from '../components/InputField';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(
        values.name.trim(),
        values.email.trim().toLowerCase(),
        values.password
      );
      navigate('/');
    } catch (error: any) {
      setError('root', {
        message: error?.response?.data?.message || 'Registration failed'
      });
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-2 text-2xl font-bold">Create account</h1>
      <p className="mb-6 text-sm text-slate-500">
        Register to manage projects and tasks.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address'
            }
          })}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />

        {errors.root ? (
          <p className="text-sm text-red-600">{errors.root.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-2 text-white disabled:opacity-70"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;