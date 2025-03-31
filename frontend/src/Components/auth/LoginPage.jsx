import React from "react";
import { Trophy, BarChart3, Gift, Activity, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const Login = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50 justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-lg my-auto"
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex w-full flex-col p-8 md:p-12 md:w-2/5">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-8">
                <Activity className="h-10 w-10 text-blue-600" />
                <span className="text-3xl font-bold">
                  <span className="text-gray-900">Fit</span>
                  <span className="text-blue-600">Verse</span>
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome Back!
              </h2>
              <p className="mt-2 text-gray-600">
                Sign in to track your fitness, join challenges, and earn
                rewards.
              </p>
            </div>
            {user ? (
              <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-100 p-6 text-center border border-gray-200">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-2 border-blue-500 object-cover shadow-sm"
                />
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.name}
                </h2>

                <p className="text-sm text-gray-600">{user.email}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="mt-4 w-full flex items-center justify-center space-x-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => login()}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <img
                      src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    Sign in with Google
                  </motion.button>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                  By signing in, you agree to our{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </a>
                  and
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </div>
              </>
            )}
          </div>
          <div
            className="hidden md:flex w-3/5 bg-cover bg-center relative" // Added relative positioning
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-black/60 to-black/70"></div>
            <div className="relative flex h-full flex-col items-center justify-center p-12 text-center text-white z-10">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6 text-4xl font-bold leading-tight"
              >
                Unlock Your Potential
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-12 text-lg text-gray-200"
              >
                Track progress, conquer challenges, and earn rewards with
                FitVerse.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid grid-cols-3 gap-6 w-full max-w-md"
              >
                <motion.div
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm p-5 shadow-lg text-gray-800 h-36"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <Trophy size={20} />
                  </div>
                  <p className="text-sm font-semibold">Challenges</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm p-5 shadow-lg text-gray-800 h-36"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <BarChart3 size={20} />
                  </div>
                  <p className="text-sm font-semibold">Progress</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm p-5 shadow-lg text-gray-800 h-36"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Gift size={20} />
                  </div>
                  <p className="text-sm font-semibold">Rewards</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
