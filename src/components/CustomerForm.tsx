import { useState } from "react";
import { useAppState } from "@/context/AppContext";
import { User, Phone, Hash } from "lucide-react";

const CustomerForm = () => {
  const { customer, setCustomer } = useAppState();
  const [expanded, setExpanded] = useState(!customer.customer_name);

  const handleChange = (field: string, value: string | number) => {
    setCustomer({ ...customer, [field]: value });
  };

  if (!expanded && customer.customer_name) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-between"
      >
        <span className="font-medium">Table {customer.table_no} • {customer.customer_name}</span>
        <span className="text-xs opacity-70">Tap to edit</span>
      </button>
    );
  }

  return (
    <div className="bg-secondary rounded-lg p-4 space-y-3 animate-fade-in">
      <h3 className="text-secondary-foreground font-semibold text-sm uppercase tracking-wider">Customer Details</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2 border border-primary/20">
          <User className="w-4 h-4 text-primary" />
          <input
            type="text"
            placeholder="Your Name"
            value={customer.customer_name}
            onChange={(e) => handleChange("customer_name", e.target.value)}
            className="bg-transparent outline-none text-secondary-foreground placeholder:text-muted-foreground text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2 border border-primary/20">
          <Phone className="w-4 h-4 text-primary" />
          <input
            type="tel"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="bg-transparent outline-none text-secondary-foreground placeholder:text-muted-foreground text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-2 border border-primary/20">
          <Hash className="w-4 h-4 text-primary" />
          <input
            type="number"
            min={1}
            placeholder="Table Number"
            value={customer.table_no}
            onChange={(e) => handleChange("table_no", parseInt(e.target.value) || 1)}
            className="bg-transparent outline-none text-secondary-foreground placeholder:text-muted-foreground text-sm flex-1"
          />
        </div>
      </div>
      {customer.customer_name && customer.phone && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default CustomerForm;
