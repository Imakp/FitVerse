import PropTypes from "prop-types";

export default function Sidebar({ categories, selectedCategory, onSelect }) {
  return (
    <aside className="w-64 p-4 bg-white border-e h-[calc(100vh-5rem)] border-gray-200">
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onSelect(category.name)}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition font-medium shadow-sm border border-gray-200 hover:bg-gray-100 ${
              selectedCategory === category.name ? "bg-gray-100" : "bg-white"
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
