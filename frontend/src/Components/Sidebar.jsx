import { useState } from "react";
import PropTypes from "prop-types";
import { Menu } from "lucide-react";

export default function Sidebar({ categories, selectedCategory, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button (Visible on Small Screens) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-md"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed sm:static top-0 left-0 h-full sm:h-auto bg-white shadow-md border border-gray-300 p-4 w-64 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 z-40`}
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onSelect(category.name)}
              className={`flex items-center gap-3 w-full px-4 h-12 py-2 transition font-medium cursor-pointer ${
                selectedCategory === category.name
                  ? "bg-gray-100 text-blue-700 font-semibold text-sm border-l-3 border-blue-500 rounded-tr-lg rounded-br-lg"
                  : "text-gray-700 text-base hover:bg-gray-50 rounded-lg"
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

Sidebar.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
