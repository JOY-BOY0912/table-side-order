import { useState, useEffect } from "react";
import { MenuItem } from "@/context/AppContext";
import CustomerForm from "@/components/CustomerForm";
import CategoryNav from "@/components/CategoryNav";
import MenuItemCard from "@/components/MenuItemCard";
import CartPanel from "@/components/CartPanel";
import OrderHistory from "@/components/OrderHistory";
import { Loader2, UtensilsCrossed, History } from "lucide-react";

const Index = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState<"menu" | "history">("menu");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("https://n8n.srv1302157.hstgr.cloud/webhook/menu");
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
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="bg-secondary px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-2 mb-3">
          <UtensilsCrossed className="w-6 h-6 text-primary" />
          <h1 className="text-secondary-foreground font-bold text-lg">Restaurant Menu</h1>
        </div>
        <CustomerForm />
      </header>

      {/* Tabs */}
      <div className="flex bg-card border-b border-border">
        <button
          onClick={() => setTab("menu")}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            tab === "menu" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" /> Menu
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            tab === "history" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          }`}
        >
          <History className="w-4 h-4" /> Order History
        </button>
      </div>

      {tab === "menu" ? (
        <div className="flex-1 flex flex-col">
          {/* Search */}
          <div className="px-4 pt-3">
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Categories */}
          <div className="px-4 pt-3">
            <CategoryNav active={category} onSelect={setCategory} />
          </div>

          {/* Menu items */}
          <div className="flex-1 px-4 py-3 space-y-2 pb-24">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No items found</p>
            ) : (
              filtered.map(item => <MenuItemCard key={item.id} item={item} />)
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 px-4 py-3">
          <OrderHistory />
        </div>
      )}

      <CartPanel />
    </div>
  );
};

export default Index;
