import { Outlet } from "react-router-dom";
import FooterLogic from "./footer/FooterLogic.jsx";
import NavbarLogic from "./navbar/NavbarLogic.jsx";

const Layout = () => {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <NavbarLogic />
        <main className="flex-grow-1 p-5">
          <Outlet />
        </main>
        <FooterLogic />
      </div>
    </>
  );
};

export default Layout;
