import { createContext, useState } from "react";

export const OrdersContext = createContext();

const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  let data = { orders, addOrder };
  return (
    <OrdersContext.Provider value={data}>{children}</OrdersContext.Provider>
  );
};

export default OrdersProvider;
