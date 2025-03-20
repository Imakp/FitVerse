import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaTrophy,
  FaWallet,
} from "react-icons/fa";
import { MdDashboard, MdDirectionsRun } from "react-icons/md";
import { IoMdFitness } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation(); // Get current route

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hide Navbar on Login Page
  if (location.pathname === "/login") {
    return null;
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user || !user._id) return;

      const controller = new AbortController();
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/balance/${user._id}`,
          { signal: controller.signal }
        );
        setBalance(response.data.balance);
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to fetch balance");
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    fetchBalance();
  }, [user?._id]); // Only triggers when `_id` changes

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // ✅ Close dropdown when clicking outsideF
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Close mobile menu when a link is clicked
  const handleNavLinkClick = () => setIsMobileMenuOpen(false);
  // ✅ Hide navbar if user is not logged in
  if (!user) return null;

  // Navigation items with icons
  const navItems = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard className="mr-2" />,
    },
    // {
    //   path: "activity",
    //   label: "Activity",
    //   icon: <MdDirectionsRun className="mr-2" />,
    // },
    {
      path: "challenges",
      label: "Challenges",
      icon: <IoMdFitness className="mr-2" />,
    },
    { path: "rewards", label: "Rewards", icon: <FaTrophy className="mr-2" /> },
    { path: "wallet", label: "Wallet", icon: <FaWallet className="mr-2" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-[95vw]">
        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/dashboard">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FITVERSE
            </h1>
          </NavLink>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FaTimes size={24} className="text-blue-600" />
          ) : (
            <FaBars size={24} className="text-blue-600" />
          )}
        </button>

        {/* Navbar Links */}
        <ul
          className={`absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0 transition-all duration-300 lg:flex lg:space-x-6 text-lg font-medium ${
            isMobileMenuOpen ? "block" : "hidden lg:flex"
          }`}
        >
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={`/${item.path}`}
                className="block py-2 text-gray-700 hover:text-blue-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.path.charAt(0).toUpperCase() + item.path.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Wallet Balance & Profile */}
        <div className="flex items-center gap-4">
          {/* Wallet Balance */}
          <button
            type="button"
            className="bg-white flex items-center focus:outline-none shadow-sm focus:ring-4 font-medium rounded-full text-sm px-3 py-1 text-center"
          >
            <div className="ml-2">
              <div className="flex items-center justify-center">
                <p className="text-lg text-green-600">
                  💰 {balance ?? 0} Coins
                </p>
              </div>
            </div>
          </button>

          {/* Profile Dropdown */}
          <div className="relative dropdown flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center space-x-2 text-gray-700 focus:outline-none"
              aria-label="User menu"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer" // 🔹 Ensures third-party images load correctly
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/default-profile.png"; // 🔹 Fallback image
                  }}
                />
              ) : (
                <FaUserCircle size={35} className="text-gray-500" />
              )}
            </button>

            {isDropdownOpen && (
              <ul className="absolute md:right-0 top-10 mt-2 min-w-[150px] bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden">
                <li>
                  <NavLink
                    to="/my-profile"
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
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
          className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
          onClick={handleNavLinkClick}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FITVERSE
            </h1>
            <button
              className="text-gray-700 justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* User profile in mobile menu */}
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

        <ul className="p-2">
          {navItems.map((item) => (
            <li key={item.path} className="my-1">
              <NavLink
                to={`/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={handleNavLinkClick}
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="my-1">
            <NavLink
              to="/my-profile"
              className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={handleNavLinkClick}
            >
              <FaUserCircle className="mr-2" />
              My Profile
            </NavLink>
          </li>
          <li className="border-t mt-2 pt-2">
            <button
              className="flex items-center w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
