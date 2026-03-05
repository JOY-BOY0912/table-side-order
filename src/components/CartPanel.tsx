import { useState } from "react";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { toast } from "sonner";

const CartPanel = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cart, customer, cartTotal, cartCount, updateQty, removeFromCart, clearCart, addOrder } = useAppState();

  const canCheckout = cart.length > 0 && customer.customer_name && customer.phone;

  const placeOrder = async () => {
    if (!canCheckout) {
      toast.error("Please fill in your details and add items to cart");
      return;
    }
    setLoading(true);
    try {
      const body = {
        customer_name: customer.customer_name,
        phone: customer.phone,
        table_no: customer.table_no,
        items: cart.map(c => ({ food: c.food_item, qty: c.qty })),
      };
      const res = await fetch("https://n8n.srv1302157.hstgr.cloud/webhook/Place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully! 🎉");
        addOrder({
          time: new Date().toLocaleTimeString(),
          table_no: customer.table_no,
          items: cart.map(c => ({ food: c.food_item, qty: c.qty })),
        });
        clearCart();
        setOpen(false);
      } else {
        toast.error("Failed to place order");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating cart button */}
      {cartCount > 0 && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full px-5 py-3 shadow-lg flex items-center gap-2 animate-slide-up"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold">{cartCount}</span>
          <span className="text-sm">• ₹{cartTotal.toFixed(2)}</span>
        </button>
      )}

      {/* Cart overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="relative mt-auto bg-card rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-lg text-card-foreground">CHECK</h2>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{item.food_item}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-primary w-16 text-right">₹{(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Total & Checkout */}
            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-border space-y-3">
                <div className="flex justify-between font-bold text-card-foreground">
                  <span>TOTAL</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={!canCheckout || loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-secondary to-primary text-primary-foreground font-bold text-base disabled:opacity-50 transition-all"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CartPanel;
