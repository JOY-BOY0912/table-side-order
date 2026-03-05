import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppContext";
import { API } from "@/config/api";
import { ArrowLeft, Minus, Plus, Trash2, User, Phone, Hash } from "lucide-react";
import { toast } from "sonner";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, customer, setCustomer, cartTotal, updateQty, removeFromCart, clearCart, addOrder } = useAppState();
  const [loading, setLoading] = useState(false);

  const canCheckout = cart.length > 0 && customer.customer_name && customer.phone;

  const handleChange = (field: string, value: string | number) => {
    setCustomer({ ...customer, [field]: value });
  };

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
      const res = await fetch(API.PLACE_ORDER, {
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
        navigate("/");
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
    <div className="min-h-screen flex items-start justify-center px-4 py-6">
      <div className="glass rounded-[20px] w-full max-w-[420px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/10">
          <button onClick={() => navigate("/")} className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center hover:bg-white/10 transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ maxHeight: "75vh" }}>
          {/* Order Summary */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="text-center text-[hsl(var(--muted-foreground))] py-6 text-sm">Your cart is empty</p>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="glass-subtle rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg shrink-0">🍽️</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.food_item}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-[hsl(var(--primary))] w-14 text-right">₹{(item.price * item.qty).toFixed(0)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-[hsl(var(--primary))]">₹{cartTotal.toFixed(0)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">Customer Details</h2>
            <div className="space-y-2">
              <div className="glass-input flex items-center gap-2 rounded-xl px-3 py-2.5">
                <User className="w-4 h-4 text-[hsl(var(--primary))]" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customer.customer_name}
                  onChange={e => handleChange("customer_name", e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-[hsl(var(--muted-foreground))]"
                />
              </div>
              <div className="glass-input flex items-center gap-2 rounded-xl px-3 py-2.5">
                <Phone className="w-4 h-4 text-[hsl(var(--primary))]" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customer.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-[hsl(var(--muted-foreground))]"
                />
              </div>
              <div className="glass-input flex items-center gap-2 rounded-xl px-3 py-2.5">
                <Hash className="w-4 h-4 text-[hsl(var(--primary))]" />
                <input
                  type="number"
                  min={1}
                  placeholder="Table Number"
                  value={customer.table_no}
                  onChange={e => handleChange("table_no", parseInt(e.target.value) || 1)}
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-[hsl(var(--muted-foreground))]"
                />
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={placeOrder}
            disabled={!canCheckout || loading}
            className="w-full py-3.5 rounded-xl bg-[hsl(var(--primary))] text-white font-bold text-base disabled:opacity-40 hover:brightness-110 transition-all active:scale-[0.98]"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
