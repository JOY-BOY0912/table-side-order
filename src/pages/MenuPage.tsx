import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@/context/AppContext";
import { useAppState } from "@/context/AppContext";
import { API } from "@/config/api";
import MenuItemCard from "@/components/MenuItemCard";
import CategoryNav from "@/components/CategoryNav";
import { Loader2, Search, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { cartTotal, cartCount } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(API.MENU);
        const data = await res.json();
        setMenu(data);
      } catch {
        console.error("Failed to fetch menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filtered = menu.filter(item => {
    const matchesCat = category === "All" || item.category?.toLowerCase() === category.toLowerCase();
    const matchesSearch = item.food_item.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-6">
      <div className="glass rounded-[20px] w-full max-w-[420px] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <Navbar />

        <div className="px-5 pb-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-sage-soft/30 transition font-body"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-5 pb-3">
          <CategoryNav active={category} onSelect={setCategory} />
        </div>

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-3" style={{ maxHeight: "60vh" }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-sage-forest animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm font-body">No items found</p>
          ) : (
            filtered.map((item, i) => (
              <div key={item.id} className={`stagger-${Math.min(i + 1, 6)}`}>
                <MenuItemCard item={item} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button
          onClick={() => navigate("/checkout")}
          className="fixed bottom-6 right-6 z-50 bg-sage-deep text-white rounded-full px-5 py-3 shadow-lg shadow-sage-deep/30 flex items-center gap-2 hover:bg-sage-forest hover:scale-105 transition-all active:scale-95 btn-transition"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold font-body">{cartCount}</span>
          <span className="text-sm font-body">• ₹{cartTotal.toFixed(0)}</span>
        </button>
      )}
    </div>
  );
};

export default MenuPage;
