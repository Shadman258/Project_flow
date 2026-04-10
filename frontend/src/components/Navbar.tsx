import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b bg-gradient-to-r from-white to-slate-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
          ProjectFlow
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-600">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-2 text-sm font-medium text-white hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
