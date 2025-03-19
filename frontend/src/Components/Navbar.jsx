// todo: remove navbar in login page.
import { Navigate, NavLink, replace, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  // Example User Data
  console.log(user);

  // todo: when logged out fix navbar.
  // todo: fix logout functionality

  const handleLogout = () => {
    logout();
    navigate("/", { replace: "true" });
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

  // Close mobile menu when a link is clicked
  const handleNavLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-gray-50 border-b shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center" style={{maxWidth: "95vw"}}>
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
        <div>
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
                    onClick={handleNavLinkClick}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </NavLink>
                </li>
              )
            )}

            {/* Profile Dropdown */}
          </ul>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            class="bg-white flex item-center focus:outline-none shadow-sm focus:ring-4 font-medium rounded-full text-sm px-3 py-1 text-center"
          >
            <svg
              class="w-6 h-6 text-yellow-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"
              />
            </svg>
            <p className="text-md text-gray-700 my-auto">500</p>
          </button>
          <li className="relative dropdown flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="space-x-2 text-gray-700 hover:text-blue-500 focus:outline-none"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle size={35} className="text-gray-500" />
              )}
              {/* <span className="hidden lg:inline">{user?.name || "user"}</span> */}
            </button>

            {isDropdownOpen && (
              <ul className="absolute md:right-0 top-10 mt-2 min-w-[150px] bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden">
                {["my-profile"].map((link) => (
                  <li key={link}>
                    <NavLink
                      to={`/${link}`}
                      className="px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {link
                        .replace("-", " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </NavLink>
                  </li>
                ))}
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
          </li>
        </div>
      </div>
    </nav>
  );
}
