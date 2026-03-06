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
        const orderRecord = {
          time: new Date().toLocaleTimeString(),
          table_no: customer.table_no,
          customer_name: customer.customer_name,
          items: cart.map(c => ({ food: c.food_item, qty: c.qty })),
          total: cartTotal,
        };
        try {
          const existing = JSON.parse(localStorage.getItem("order_history") || "[]");
          existing.unshift(orderRecord);
          localStorage.setItem("order_history", JSON.stringify(existing));
        } catch {}
        addOrder({
          time: orderRecord.time,
          table_no: customer.table_no,
          items: orderRecord.items,
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
      <div className="glass rounded-[20px] w-full max-w-[420px] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-sage-soft/20">
          <button onClick={() => navigate("/")} className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center hover:bg-sage-light/50 transition btn-transition">
            <ArrowLeft className="w-4 h-4 text-sage-deep" />
          </button>
          <h1 className="text-xl font-bold font-display text-sage-deep">Checkout</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ maxHeight: "75vh" }}>
          {/* Order Summary */}
          <div className="animate-fade-in-up">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 font-heading">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-6 text-sm font-body">Your cart is empty</p>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="glass-subtle rounded-xl p-3 flex items-center gap-3 card-hover">
                    <div className="w-10 h-10 rounded-lg bg-sage-light/50 flex items-center justify-center text-lg shrink-0">🍽️</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-sage-deep font-heading">{item.food_item}</p>
                      <p className="text-xs text-muted-foreground font-body">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-sage-light/50 flex items-center justify-center hover:bg-sage-light transition text-sage-deep">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-sage-deep">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-sage-light/50 flex items-center justify-center hover:bg-sage-light transition text-sage-deep">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-sage-deep w-14 text-right font-display">₹{(item.price * item.qty).toFixed(0)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-3 border-t border-sage-soft/20">
                  <span className="font-semibold text-sage-deep font-heading">Total</span>
                  <span className="text-lg font-bold text-sage-deep font-display">₹{cartTotal.toFixed(0)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="animate-fade-in-up stagger-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 font-heading">Customer Details</h2>
            <div className="space-y-2">
              <div className="glass-input flex items-center gap-2 rounded-xl px-3 py-2.5">
                <User className="w-4 h-4 text-sage-forest" />
                <input
                  type="text"
                  placeholder="Name"
                  value={customer.customer_name}
                  onChange={e => handleChange("customer_name", e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground text-sage-deep font-body"
                />
              </div>
              <div className="glass-input flex items-center gap-2 rounded-xl px-3 py-2.5">
                <Phone className="w-4 h-4 text-sage-forest" />
                <input
                  type="tel"
                  placeholder="Phone No."
                  value={customer.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground text-sage-deep font-body"
                />
              </div>
              <div className="glass-input flex items-center gap-2 rounded-xl px-3 py-2.5">
                <Hash className="w-4 h-4 text-sage-forest" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Table No."
                  value={customer.table_no || ""}
                  onChange={e => handleChange("table_no", e.target.value === "" ? "" : parseInt(e.target.value) || "")}
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground text-sage-deep font-body"
                />
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={placeOrder}
            disabled={!canCheckout || loading}
            className="w-full py-3.5 rounded-[10px] bg-sage-deep text-white font-bold text-base disabled:opacity-40 hover:bg-sage-forest transition-all active:scale-[0.98] btn-transition font-body"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
