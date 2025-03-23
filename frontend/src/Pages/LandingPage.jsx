import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Activity,
  Users,
  Calendar,
  BarChart2,
  Gift,
  ShieldCheck,
} from "lucide-react";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 font-sans text-gray-800 relative">
      {/* Dotted pattern background */}
      <div
        className="fixed inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #4a5568 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Subtle animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-96 -right-32 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/2 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">FitVerse</span>
        </div>
        <div className="hidden md:flex space-x-8 items-center">
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Testimonials
          </a>
          <Link
            to="/"
            className="bg-gradient-to-br from-purple-500 to-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Login
          </Link>
        </div>
        <button className="md:hidden text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-700 mb-6">
              Earn Rewards for Your Fitness Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Complete fitness challenges, track your progress with Google Fit,
              and earn exciting rewards. Your dedication deserves recognition!
            </p>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-purple-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg transition-colors inline-flex items-center"
              >
                Start Earning Rewards <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Dashboard mockup */}
            <div className="relative mx-auto w-full max-w-xl">
              <div
                className="relative bg-gray-800 rounded-t-xl rounded-b-sm shadow-2xl overflow-hidden border-t border-l border-r border-gray-700"
                style={{
                  paddingBottom: "56.25%", // 16:9 aspect ratio
                }}
              >
                <img
                  src="./laptop_dashboard.jpg"
                  alt="FitVerse Dashboard"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div
                className="h-4 bg-gray-900 rounded-b-xl mx-auto"
                style={{ width: "98%" }}
              ></div>
              <div
                className="h-1 bg-gray-800 rounded-b-xl mx-auto"
                style={{ width: "90%" }}
              ></div>
            </div>

            {/* Floating elements animation */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                x: [0, 5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              }}
              className="absolute -top-6 -right-6 bg-white p-3 rounded-lg shadow-lg"
            >
              <Activity className="h-6 w-6 text-blue-500" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
                x: [0, -8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-lg"
            >
              <BarChart2 className="h-6 w-6 text-purple-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete challenges, track your progress, and earn rewards for
              your fitness achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Gift className="h-8 w-8 text-blue-500" />,
                title: "Challenge Rewards",
                description:
                  "Participate in exciting challenges and earn bonus points and exclusive prizes for your achievements.",
              },
              {
                icon: <Activity className="h-8 w-8 text-blue-500" />,
                title: "Track Progress",
                description:
                  "Monitor your fitness journey, stay consistent, and earn extra rewards for maintaining streaks.",
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
                title: "Blockchain-based Coins",
                description:
                  "Earn secure, blockchain-backed Coins for reaching new fitness milestones that can be used in real life.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our users are earning rewards while achieving their
              fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600">Fitness Enthusiast</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "I've earned over 5000 points in just two months! The rewards
                system is incredibly motivating, and I love how it recognizes my
                daily achievements."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <p className="text-gray-600">Marathon Runner</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "The rewards system is fantastic! I've earned special badges and
                exclusive rewards for completing marathon training challenges.
                It's like getting paid to stay fit!"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Emma Rodriguez"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">
                    Emma Rodriguez
                  </h4>
                  <p className="text-gray-600">Yoga Instructor</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                "I love how FitVerse rewards me for maintaining a balanced
                fitness routine. The points system is fun and motivating, and
                I've earned some amazing rewards!"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">FitVerse</h3>
              <p className="mb-4 max-w-md">
                Your comprehensive fitness tracking companion that transforms
                Google Fit data into actionable insights and engaging
                challenges.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <p>
                <a
                  href="mailto:support@fitverse.com"
                  className="hover:text-white transition-colors"
                >
                  support@fitverse.com
                </a>
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p>
              &copy; {new Date().getFullYear()} FitVerse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add animation keyframes for the blobs */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
