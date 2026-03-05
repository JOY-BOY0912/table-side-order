import { useAppState } from "@/context/AppContext";
import { Clock, Hash } from "lucide-react";

const OrderHistory = () => {
  const { orders } = useAppState();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">No orders placed yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order, i) => (
        <div key={i} className="bg-card rounded-lg p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{order.time}</span>
            <span className="flex items-center gap-1"><Hash className="w-3 h-3" />Table {order.table_no}</span>
          </div>
          <div className="space-y-1">
            {order.items.map((item, j) => (
              <div key={j} className="flex justify-between text-sm">
                <span className="text-card-foreground">{item.food}</span>
                <span className="text-muted-foreground">x{item.qty}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
