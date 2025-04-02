import { useState } from "react";
import PropTypes from "prop-types";
import { Menu } from "lucide-react";

export default function Sidebar({ categories, selectedCategory, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed m-4 z-50 p-2 rounded-lg text-gray-700 bg-white shadow-md border border-gray-300 hover:bg-gray-100 transition duration-200"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      <aside
        className={`fixed h-screen z-40 bg-white shadow-md border-r border-gray-200 p-4 w-60 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
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
