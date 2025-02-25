import { createContext, useEffect, useState } from "react";

export const TablesContext = createContext();

const TablesProvider = ({ children }) => {
  const [activeTables, setActiveTables] = useState(new Set());

  const openTable = (tableNumber) => {
    setActiveTables((prev) => new Set([...prev, tableNumber]));
  };

  const closeTable = (tableNumber) => {
    setActiveTables((prev) => {
      const newSet = new Set(prev);
      newSet.delete(tableNumber);
      return newSet;
    });
  };

  const isTableActive = (tableNumber) => {
    return activeTables.has(tableNumber); // Verifica si la mesa está en el Set
  };

  let data = {
    activeTables,
    openTable,
    closeTable,
    isTableActive,
    setActiveTables,
  };
  return (
    <TablesContext.Provider value={data}>{children}</TablesContext.Provider>
  );
};

export default TablesProvider;
