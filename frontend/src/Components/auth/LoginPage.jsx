import React from "react";
import { Trophy, BarChart3, Gift } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 justify-center px-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-md my-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left Panel - Login Form */}
          <div className="flex w-full flex-col p-10 md:w-2/5">
            <div className="mb-10">
              <h1 className="text-4xl font-bold">
                <span className="text-gray-800">Fit</span>
                <span className="text-blue-600">Verse</span>
              </h1>
              <h2 className="mt-6 text-2xl font-bold text-gray-800">
                Welcome Back
              </h2>
              <p className="mt-3 text-gray-600">
                Log in to track your workouts, set new goals, and continue your
                fitness journey.
              </p>
            </div>

            {user ? (
              <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-50 p-8 text-center">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-2 border-blue-500 object-cover"
                />
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <button
                  onClick={logout}
                  className="mt-6 w-full rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-all hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <button
                    onClick={() => login()}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700"
                  >
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    Sign in with Google
                  </button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                  By signing in, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Image and Features */}
          <div
            className="hidden w-3/5 bg-cover bg-center text-white md:block"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D')`,
            }}
          >
            <div className="flex h-full flex-col items-center justify-center p-12 text-center">
              <h2 className="mb-8 text-4xl font-bold leading-tight">
                Transform Your Fitness Journey
              </h2>
              <p className="mb-16 text-lg">
                Join thousands of users who have achieved their fitness goals
                with FitVerse.
              </p>

              {/* Feature Cards with Modern Design */}
              <div className="flex w-full justify-between gap-4 px-4">
                <div className="transform transition-all duration-300 hover:-translate-y-1">
                  <div className="flex h-36 w-28 flex-col items-center justify-center rounded-lg bg-black bg-opacity-30 p-4 backdrop-blur-sm">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black bg-opacity-30">
                      <Trophy className="h-6 w-6 text-yellow-400" />
                    </div>
                    <p className="text-base font-medium text-white">
                      Challenges
                    </p>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="transform transition-all duration-300 hover:-translate-y-1">
                  <div className="flex h-36 w-28 flex-col items-center justify-center rounded-lg bg-black bg-opacity-30 p-4 backdrop-blur-sm">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black bg-opacity-30">
                      <BarChart3 className="h-6 w-6 text-green-400" />
                    </div>
                    <p className="text-base font-medium text-white">Progress</p>
                  </div>
                </div>

                {/* Rewards Card */}
                <div className="transform transition-all duration-300 hover:-translate-y-1">
                  <div className="flex h-36 w-28 flex-col items-center justify-center rounded-lg bg-black bg-opacity-30 p-4 backdrop-blur-sm">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black bg-opacity-30">
                      <Gift className="h-6 w-6 text-red-400" />
                    </div>
                    <p className="text-base font-medium text-white">Rewards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
