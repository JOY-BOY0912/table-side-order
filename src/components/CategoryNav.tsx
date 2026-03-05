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
          className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
            active === cat
              ? "bg-[hsl(var(--primary))] text-white shadow-lg shadow-black/20"
              : "bg-white/8 text-[hsl(var(--muted-foreground))] hover:bg-white/15 border border-white/10"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
