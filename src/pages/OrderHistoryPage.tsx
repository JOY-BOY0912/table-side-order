import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ShoppingBag } from "lucide-react";

interface OrderHistoryItem {
  time: string;
  table_no: number;
  customer_name: string;
  items: { food: string; qty: number }[];
  total: number;
}

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("order_history");
      if (stored) setOrders(JSON.parse(stored));
    } catch {
      console.error("Failed to load order history");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-6">
      <div className="glass rounded-[20px] w-full max-w-[420px] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-sage-soft/20">
          <button
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-full glass-subtle flex items-center justify-center hover:bg-sage-light/50 transition btn-transition"
          >
            <ArrowLeft className="w-4 h-4 text-sage-deep" />
          </button>
          <h1 className="text-xl font-bold font-display text-sage-deep">Order History</h1>
        </div>

        {/* Orders */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ maxHeight: "75vh" }}>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ShoppingBag className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-body">No orders placed yet</p>
            </div>
          ) : (
            orders.map((order, idx) => (
              <div key={idx} className="glass-subtle rounded-xl p-4 space-y-2.5 card-hover animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-sage-deep font-display">Order #{orders.length - idx}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="font-body">{order.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                  <span>👤 {order.customer_name}</span>
                  <span>🪑 Table {order.table_no}</span>
                </div>

                <div className="border-t border-sage-soft/20 pt-2 space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm font-body">
                      <span className="text-sage-deep">{item.food}</span>
                      <span className="text-muted-foreground">x{item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end border-t border-sage-soft/20 pt-2">
                  <span className="text-sm font-bold text-sage-deep font-display">Total ₹{order.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
