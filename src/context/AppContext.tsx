import React, { createContext, useContext, useState, useCallback } from "react";

export interface MenuItem {
  id: number;
  food_item: string;
  status: string;
  price: number;
  category?: string;
}

export interface CartItem {
  id: number;
  food_item: string;
  price: number;
  qty: number;
}

export interface OrderRecord {
  time: string;
  table_no: number;
  items: { food: string; qty: number }[];
}

export interface CustomerInfo {
  customer_name: string;
  phone: string;
  table_no: number;
}

interface AppState {
  cart: CartItem[];
  customer: CustomerInfo;
  orders: OrderRecord[];
  setCustomer: (c: CustomerInfo) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
  addOrder: (order: OrderRecord) => void;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppState | null>(null);

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo>({ customer_name: "", phone: "", table_no: 1 });
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, food_item: item.food_item, price: item.price, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newQty = c.qty + delta;
      return newQty <= 0 ? c : { ...c, qty: newQty };
    }).filter(c => c.qty > 0));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const addOrder = useCallback((order: OrderRecord) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <AppContext.Provider value={{ cart, customer, orders, setCustomer, addToCart, removeFromCart, updateQty, clearCart, addOrder, cartTotal, cartCount }}>
      {children}
    </AppContext.Provider>
  );
};
