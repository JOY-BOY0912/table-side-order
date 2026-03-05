import { Utensils } from "lucide-react";

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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 -mx-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
            active === cat
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card text-card-foreground hover:bg-primary/10"
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
