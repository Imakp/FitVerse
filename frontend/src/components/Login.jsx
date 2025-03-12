import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={user.picture}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <button
              onClick={logout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to FitVerse</h2>
            <button
              onClick={() => login()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
