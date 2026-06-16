import { createContext, useContext, useState, type ReactNode } from "react";

type Cart = Map<number, number>; // productId → quantity

interface CartContextValue {
  cart: Cart;
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextValue>({
  cart: new Map(),
  addItem: () => {},
  removeItem: () => {},
  clear: () => {},
  totalItems: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(new Map());

  const addItem = (productId: number) => {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(productId, (next.get(productId) ?? 0) + 1);
      return next;
    });
  };

  const removeItem = (productId: number) => {
    setCart((prev) => {
      const next = new Map(prev);
      const qty = next.get(productId) ?? 0;
      if (qty <= 1) next.delete(productId);
      else next.set(productId, qty - 1);
      return next;
    });
  };

  const clear = () => setCart(new Map());

  const totalItems = [...cart.values()].reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clear, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
