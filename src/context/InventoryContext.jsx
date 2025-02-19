import React, { createContext, useEffect, useState } from "react";

export const InventoryContext = createContext();

const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

 

  const fetchInventory = async () => {
    try {
      const querySnapShot = await getDocs(collection(db, "inventory"));
      const data = querySnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(data);
    } catch (error) {

    }
  };

  let data = { addProductDB };
  return (
    <InventoryContext.Provider value={data}>
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryProvider;
