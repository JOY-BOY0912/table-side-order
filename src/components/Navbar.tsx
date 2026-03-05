import { useNavigate } from "react-router-dom";
import { Clock, UtensilsCrossed } from "lucide-react";
import logo from "@/assets/logo/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-2.5">
        <img
          src={logo}
          alt="Restaurant Logo"
          className="w-9 h-9 rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">Restaurant Menu</h1>
      </div>
      <button
        onClick={() => navigate("/order-history")}
        className="glass-subtle flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-[hsl(var(--foreground))] hover:bg-white/10 transition border border-white/20"
      >
        <Clock className="w-3.5 h-3.5" />
        <span>History</span>
      </button>
    </div>
  );
};

export default Navbar;
