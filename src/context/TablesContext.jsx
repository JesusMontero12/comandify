import { createContext, useState } from "react";

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
    return activeTables.has(tableNumber);
  };

  let data = { activeTables, openTable, closeTable, isTableActive };
  return (
    <TablesContext.Provider value={data}>{children}</TablesContext.Provider>
  );
};

export default TablesProvider;
