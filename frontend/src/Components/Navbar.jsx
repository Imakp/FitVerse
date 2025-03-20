import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaTrophy,
  FaWallet,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoMdFitness } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation(); // Get current route

  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  // Hide Navbar on Login Page
  if (location.pathname === "/login") return null;

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user || !user._id) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/balance/${user._id}`
        );
        setBalance(response.data.balance);
      } catch {
        setError("Failed to fetch balance");
      }
    };

    fetchBalance();
  }, [user?._id]); // Fetch balance when user ID changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) setIsDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!user) return null; // Hide navbar if not logged in

  const navItems = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard className="mr-2" />,
    },
    {
      path: "challenges",
      label: "Challenges",
      icon: <IoMdFitness className="mr-2" />,
    },
    { path: "rewards", label: "Rewards", icon: <FaTrophy className="mr-2" /> },
    { path: "wallet", label: "Wallet", icon: <FaWallet className="mr-2" /> },
  ];

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/dashboard">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FITVERSE
          </h1>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 p-2 rounded-md focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <FaTimes size={24} className="text-blue-600" />
          ) : (
            <FaBars size={24} className="text-blue-600" />
          )}
        </button>

        {/* Navbar Links (Desktop) */}
        <ul className="hidden lg:flex space-x-6 text-lg font-medium">
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={`/${path}`}
                className="text-gray-700 hover:text-blue-500"
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Profile & Wallet Balance */}
        <div className="flex items-center gap-4">
          {/* Wallet Balance */}
          <div className="bg-white flex items-center px-3 py-1 rounded-full shadow-sm text-green-600 text-lg">
            💰 {balance ?? 0} Coins
          </div>

          {/* Profile Dropdown */}
          <div className="relative dropdown">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle size={35} className="text-gray-500" />
              )}
            </button>

            {isDropdownOpen && (
              <ul className="absolute right-0 top-12 mt-2 w-40 bg-white border shadow-lg rounded-md overflow-hidden">
                <li>
                  <NavLink
                    to="/my-profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    onClick={() => {
                      logout();
                      navigate("/", { replace: true });
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu (Slide-in) */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FITVERSE
          </h1>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <FaTimes size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Profile in Mobile Menu */}
        <div className="flex items-center gap-3 p-4 border-b">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle size={30} className="text-gray-500" />
          )}
          <div>
            <p className="font-medium text-gray-800">{user?.name || "User"}</p>
            <p className="text-sm text-gray-500 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>

        {/* Mobile Menu Links */}
        <ul className="p-2">
          {navItems.map(({ path, label }) => (
            <li key={path} className="my-1">
              <NavLink
                to={`/${path}`}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
