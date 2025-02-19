import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import SalesLogic from "./components/pages/sales/SalesLogic.jsx";
import ProductsLogic from "./components/pages/products/ProductsLogic.jsx";
import InventoryLogic from "./components/pages/inventory/InventoryLogic.jsx";
import CashRegisterLogic from "./components/pages/cashregister/CashRegisterLogic.jsx";
import ProductProvider from "./context/ProductContext.jsx";
import OrdersProvider from "./context/OrdersContext.jsx";
import TablesProvider from "./context/TablesContext.jsx";
import TablesOrdersLogic from "./components/pages/tablesorders/TablesOrdersLogic.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <ProductProvider>
          <OrdersProvider>
            <TablesProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<TablesOrdersLogic />} />
                  <Route path="/sales" element={<SalesLogic />} />
                  <Route path="/products" element={<ProductsLogic />} />
                  <Route path="/inventory" element={<InventoryLogic />} />
                  <Route
                    path="/cash-register"
                    element={<CashRegisterLogic />}
                  />
                </Route>
              </Routes>
            </TablesProvider>
          </OrdersProvider>
        </ProductProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
