import { Plus, Minus, Ban } from "lucide-react";
import { useAppState, MenuItem } from "@/context/AppContext";
import { toast } from "sonner";

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const { cart, addToCart, updateQty } = useAppState();
  const cartItem = cart.find(c => c.id === item.id);
  const isOutOfStock = item.status === "Out of Stock";

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(item);
    toast.success(`${item.food_item} added to cart`);
  };

  return (
    <div
      className={`flex items-center gap-3 bg-card rounded-lg p-3 shadow-sm transition-all ${
        isOutOfStock ? "opacity-50" : "hover:shadow-md"
      }`}
    >
      {/* Food image placeholder */}
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        <span className="text-2xl">🍽️</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-card-foreground truncate">{item.food_item}</h4>
        {isOutOfStock && (
          <span className="text-xs text-destructive font-medium flex items-center gap-1">
            <Ban className="w-3 h-3" /> Out of Stock
          </span>
        )}
      </div>

      {/* Price & Actions */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="font-bold text-primary text-sm">₹{item.price.toFixed(2)}</span>

        {isOutOfStock ? (
          <div className="w-8 h-8" />
        ) : cartItem ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQty(item.id, -1)}
              className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold">{cartItem.qty}</span>
            <button
              onClick={() => updateQty(item.id, 1)}
              className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
