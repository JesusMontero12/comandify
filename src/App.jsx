import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomeLogic from "./components/pages/home/HomeLogic.jsx";
import OrdersLogic from "./components/pages/orders/OrdersLogic.jsx";
import TablesLogic from "./components/pages/tables/TablesLogic.jsx";
import SalesLogic from "./components/pages/sales/SalesLogic.jsx";
import ProductsLogic from "./components/pages/products/ProductsLogic.jsx";
import InventoryLogic from "./components/pages/inventory/InventoryLogic.jsx";
import CashRegisterLogic from "./components/pages/cashregister/CashRegisterLogic.jsx";
import ProductProvider from "./context/ProductContext.jsx";
import OrdersProvider from "./context/OrdersContext.jsx";
import TablesProvider from "./context/TablesContext.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <ProductProvider>
          <OrdersProvider>
            <TablesProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomeLogic />} />
                  <Route path="/orders" element={<OrdersLogic />} />
                  <Route path="/tables" element={<TablesLogic />} />
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
