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
      className={`glass-subtle rounded-xl p-3 flex items-center gap-3 card-hover animate-fade-in-up ${
        isOutOfStock ? "opacity-40" : ""
      }`}
    >
      {/* Food image placeholder */}
      <div className="w-14 h-14 rounded-xl bg-sage-light/50 flex items-center justify-center shrink-0">
        <span className="text-2xl">🍽️</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-heading font-semibold text-sm truncate text-sage-deep">{item.food_item}</h4>
        {isOutOfStock ? (
          <span className="text-xs text-destructive font-medium flex items-center gap-1 mt-0.5 font-body">
            <Ban className="w-3 h-3" /> Out of Stock
          </span>
        ) : (
          <span className="text-xs text-muted-foreground font-body">
            {item.category || "Food"}
          </span>
        )}
      </div>

      {/* Price & Actions */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="font-bold text-sage-deep text-sm font-display">₹{item.price}</span>

        {isOutOfStock ? (
          <div className="h-7" />
        ) : cartItem ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQty(item.id, -1)}
              className="w-7 h-7 rounded-full bg-sage-light/50 flex items-center justify-center hover:bg-sage-light transition text-sage-deep"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-sage-deep">{cartItem.qty}</span>
            <button
              onClick={() => updateQty(item.id, 1)}
              className="w-7 h-7 rounded-full bg-sage-deep text-white flex items-center justify-center hover:bg-sage-forest transition btn-transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="px-3 py-1 rounded-[10px] bg-sage-deep text-white text-xs font-semibold hover:bg-sage-forest transition btn-transition active:scale-95 font-body"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
