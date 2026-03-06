const categories = [
  "All", "Salad", "Burger", "Side dish", "Fried Chicken",
  "Spaghetti", "Rice", "Set menu", "Fish", "Drinks"
];

interface CategoryNavProps {
  active: string;
  onSelect: (cat: string) => void;
}

const CategoryNav = ({ active, onSelect }: CategoryNavProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium font-body transition-all shrink-0 btn-transition ${
            active === cat
              ? "bg-sage-deep text-white shadow-lg shadow-sage-deep/20"
              : "bg-sage-light/40 text-sage-forest hover:bg-sage-light/70 border border-sage-soft/20"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
