import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
      console.log(user);

      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/balance/${user._id}`
        );
        setBalance(response.data.balance);
      } catch (err) {
        setError("Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-50 border-b shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-[95vw]">
        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-700">FITVERSE</h1>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Navbar Links */}
        <ul
          className={`absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0 transition-all duration-300 lg:flex lg:space-x-6 text-lg font-medium ${
            isMobileMenuOpen ? "block" : "hidden lg:flex"
          }`}
        >
          {["dashboard", "activity", "challenges", "rewards", "wallet"].map(
            (item) => (
              <li key={item}>
                <NavLink
                  to={`/${item}`}
                  className="block py-2 text-gray-700 hover:text-blue-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </NavLink>
              </li>
            )
          )}
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
                {loading ? (
                  <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <p className="text-lg text-green-600">💰 {balance} Coins</p>
                )}
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
              className="space-x-2 text-gray-700 hover:text-blue-500 focus:outline-none"
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
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
