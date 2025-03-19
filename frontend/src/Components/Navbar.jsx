import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes, FaTrophy, FaWallet } from "react-icons/fa";
import { MdDashboard, MdDirectionsRun } from "react-icons/md";
import { IoMdFitness } from "react-icons/io";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ Redirect to login after logout
  const handleLogout = () => {
    logout(); 
    navigate("/", { replace: true });
  };

  // ✅ Close dropdown when clicking outside
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
    { path: "dashboard", label: "Dashboard", icon: <MdDashboard className="mr-2" /> },
    { path: "activity", label: "Activity", icon: <MdDirectionsRun className="mr-2" /> },
    { path: "challenges", label: "Challenges", icon: <IoMdFitness className="mr-2" /> },
    { path: "rewards", label: "Rewards", icon: <FaTrophy className="mr-2" /> },
    { path: "wallet", label: "Wallet", icon: <FaWallet className="mr-2" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <NavLink
            to="/dashboard">
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

        {/* Navbar Links - Desktop */}
        <ul className="hidden lg:flex space-x-1 items-center">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={`/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Profile and Currency */}
        <div className="flex items-center gap-4">
          {/* Currency Badge */}
          <button
            type="button"
            className="bg-white flex items-center gap-1 focus:outline-none border border-gray-200 hover:border-yellow-400 transition-all duration-200 rounded-full px-4 py-2 shadow-sm"
          >
            <svg
              className="w-5 h-5 text-yellow-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"
              />
            </svg>
            <span className="font-semibold text-gray-800">500</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative dropdown">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="flex items-center space-x-2 text-gray-700 focus:outline-none"
              aria-label="User menu"
            >
              <div className="relative">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 hover:border-blue-300 transition-all duration-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100 hover:border-blue-300 transition-all duration-200">
                    <FaUserCircle size={24} className="text-blue-600" />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
            </button>

            {isDropdownOpen && (
              <ul className="absolute right-0 top-12 w-48 bg-white border border-gray-100 shadow-lg rounded-lg overflow-hidden z-50">
                <li className="border-b border-gray-100 px-4 py-3">
                  <p className="font-medium text-gray-800">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                </li>
                <li>
                  <NavLink
                    to="/my-profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUserCircle className="mr-2" />
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
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
        <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-40" onClick={handleNavLinkClick}></div>
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
            <p className="text-sm text-gray-500 truncate">{user?.email || "user@example.com"}</p>
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
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}