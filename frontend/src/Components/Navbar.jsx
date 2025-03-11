import { NavLink } from "react-router";
import { useState } from "react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">FitVerse</h1>
        <ul className="flex space-x-6 text-lg font-medium relative">
          <li>
            <NavLink
              to="/dashboard"
              className="text-gray-700 hover:text-blue-500 transition"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/activity"
              className="text-gray-700 hover:text-blue-500 transition"
            >
              Activity
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rewards"
              className="text-gray-700 hover:text-blue-500 transition"
            >
              Rewards
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/challenges"
              className="text-gray-700 hover:text-blue-500 transition"
            >
              Challenges
            </NavLink>
          </li>
          <li className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-700 hover:text-blue-500 transition focus:outline-none"
            >
              Profile
            </button>
            {isDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden">
                <li>
                  <NavLink
                    to="/my-profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" className="block px-4 py-2 hover:bg-gray-100">
                    Settings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/" className="block px-4 py-2 hover:bg-gray-100">
                    Help
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
