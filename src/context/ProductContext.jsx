import { createContext, useState } from "react";
import { db } from "../firebaseConfig";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Hamburguesa Clásica",
      price: 10.99,
      category: "Hamburguesas",
    },
    { id: 2, name: "Pizza Margherita", price: 12.99, category: "Pizzas" },
    { id: 3, name: "Ensalada César", price: 8.99, category: "Ensaladas" },
    { id: 4, name: "Coca-Cola", price: 2.5, category: "Bebidas" },
    { id: 5, name: "Cerveza", price: 4.99, category: "Bebidas" },
  ]);

  

  let data = { products, setProducts };
  return (
    <ProductContext.Provider value={data}>{children}</ProductContext.Provider>
  );
};

export default ProductProvider;
