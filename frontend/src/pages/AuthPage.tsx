import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { InputField } from '../components/InputField';

interface LoginFormValues {
  email: string;
  password: string;
}

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    setError: setLoginError,
    reset: resetLoginForm
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const {
    register: registerField2,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
    setError: setRegisterError,
    reset: resetRegisterForm
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      await login(
        values.email.trim().toLowerCase(),
        values.password
      );
      navigate('/');
    } catch (error: any) {
      setLoginError('root', {
        message: error?.response?.data?.message || 'Login failed'
      });
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(
        values.name.trim(),
        values.email.trim().toLowerCase(),
        values.password
      );
      navigate('/');
    } catch (error: any) {
      setRegisterError('root', {
        message: error?.response?.data?.message || 'Registration failed'
      });
    }
  };

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setIsLogin(tab === 'login');
    resetLoginForm();
    resetRegisterForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Tab Switcher */}
        <div className="mb-8 flex gap-2 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 rounded-lg py-2.5 px-4 font-semibold transition-all duration-300 ${
              isLogin
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700'
                : 'bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 rounded-lg py-2.5 px-4 font-semibold transition-all duration-300 ${
              !isLogin
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:from-green-600 hover:to-green-700'
                : 'bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {isLogin && (
          <div className="animate-fadeIn">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Welcome back</h1>
            <p className="mb-6 text-sm text-slate-500">
              Sign in to manage your projects and tasks.
            </p>

            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-5">
              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={loginErrors.email?.message}
                {...registerField('email', {
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
                error={loginErrors.password?.message}
                {...registerField('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />

              {loginErrors.root ? (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {loginErrors.root.message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoginSubmitting}
                className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-2.5 text-white font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-70 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoginSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        )}

        {/* Register Form */}
        {!isLogin && (
          <div className="animate-fadeIn">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Create account</h1>
            <p className="mb-6 text-sm text-slate-500">
              Register to manage projects and tasks.
            </p>

            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
              <InputField
                label="Name"
                placeholder="Enter your name"
                error={registerErrors.name?.message}
                {...registerField2('name', {
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
                error={registerErrors.email?.message}
                {...registerField2('email', {
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
                error={registerErrors.password?.message}
                {...registerField2('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />

              {registerErrors.root ? (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {registerErrors.root.message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isRegisterSubmitting}
                className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-2.5 text-white font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-70 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isRegisterSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
