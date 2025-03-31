import { useState } from "react";
import PropTypes from "prop-types";
import { Menu } from "lucide-react";

export default function Sidebar({ categories, selectedCategory, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:bg-gray-100 focus:outline-none transition-colors duration-150"
        aria-label="Toggle sidebar"
      >
        <Menu size={22} />
      </button>

      <aside
        className={`fixed sm:sticky top-0 left-0 h-screen sm:h-auto sm:top-16  bg-white shadow-md border-r border-gray-200 p-4 w-60 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 z-40 sm:rounded-lg sm:mt-4`}
      >
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                onSelect(category.name);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                selectedCategory === category.name
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {category.icon}
              </span>
              <span className="flex-1 text-left">{category.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
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
