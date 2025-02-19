import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
  FaBox,
  FaBoxes,
  FaCashRegister,
  FaChair,
  FaChartBar,
  FaClipboard,
} from "react-icons/fa";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const NavBar = () => {
  const renderTooltip = (text) => (
    <Tooltip id={`tooltip-${text}`}>{text}</Tooltip>
  );
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <div className="d-flex w-100 justify-content-between align-items-center">
            <Navbar.Brand className="me-auto">Comandify POS</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </div>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-lg-auto d-flex flex-lg-row flex-column align-items-lg-end align-items-start">
              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Mesas")}
              >
                <Nav.Link as={NavLink} to="/">
                  <FaChair /> <span className="d-lg-none">Mesas</span>
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Ventas")}
              >
                <Nav.Link as={NavLink} to="/sales">
                  <FaChartBar /> <span className="d-lg-none">Ventas</span>
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Productos")}
              >
                <Nav.Link as={NavLink} to="/products">
                  <FaBox /> <span className="d-lg-none">Productos</span>
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Inventario")}
              >
                <Nav.Link as={NavLink} to="/inventory">
                  <FaBoxes /> <span className="d-lg-none">Inventario</span>
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={renderTooltip("Arqueo de Caja")}
              >
                <Nav.Link as={NavLink} to="/cash-register">
                  <FaCashRegister />{" "}
                  <span className="d-lg-none">Arqueo de Caja</span>
                </Nav.Link>
              </OverlayTrigger>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
