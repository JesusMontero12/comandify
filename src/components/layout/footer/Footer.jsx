import { Container } from "react-bootstrap";
import "./Footer.css";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="bg-dark text-light py-4 mt-auto">
        <Container>
          <div className="text-center">
            <p className="mb-1">Comandify POS System</p>
            <p className="mb-0 text-light">
              Hecho con <FaHeart className="text-danger mx-1" />
              {new Date().getFullYear()}
            </p>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
