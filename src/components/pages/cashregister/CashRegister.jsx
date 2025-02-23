import "./CashRegister.css";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

const CashRegister = () => {
  return (
    <>
      <h2 className="mb-4">Arqueo de Caja</h2>
      <Card>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Efectivo Inicial</Form.Label>
                  <Form.Control type="number" placeholder="Monto inicial" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Efectivo Final</Form.Label>
                  <Form.Control type="number" placeholder="Monto final" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ventas en Efectivo</Form.Label>
                  <Form.Control type="number" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ventas con Tarjeta</Form.Label>
                  <Form.Control type="number" readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Realizar Arqueo
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default CashRegister;
