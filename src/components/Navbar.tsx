import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import logo from "@/assets/logo/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-2.5">
        <img
          src={logo}
          alt="ISH Legacy Logo"
          className="w-9 h-9 rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <h1 className="text-xl font-bold font-display text-sage-deep">ISH Legacy</h1>
      </div>
      <button
        onClick={() => navigate("/order-history")}
        className="glass-subtle flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-sage-deep hover:bg-sage-light/50 transition border border-sage-soft/20 btn-transition"
      >
        <Clock className="w-3.5 h-3.5" />
        <span className="font-body">History</span>
      </button>
    </div>
  );
};

export default Navbar;
