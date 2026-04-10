import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { InputField } from '../components/InputField';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(
        values.email.trim().toLowerCase(),
        values.password
      );
      navigate('/');
    } catch (error: any) {
      setError('root', {
        message: error?.response?.data?.message || 'Login failed'
      });
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-3xl font-bold text-gray-800">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-500">
        Sign in to manage your projects and tasks.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {errors.root.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 text-white font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 transition-all duration-200"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;