import "./Orders.css";
import { useContext, useEffect, useState } from "react";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  ListGroup,
  Badge,
  Toast,
} from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ProductContext } from "../../../context/ProductContext";
import { OrdersContext } from "../../../context/OrdersContext";
import { useLocation, useNavigate } from "react-router-dom";
import { TablesContext } from "../../../context/TablesContext";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  const { addOrder } = useContext(OrdersContext);
  const { openTable } = useContext(TablesContext);
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [order, setOrder] = useState({
    table: "",
    items: [],
    notes: "",
  });

  useEffect(() => {
    if (location.state?.selectedTable) {
      setOrder((prev) => ({
        ...prev,
        table: location.state.selectedTable.toString(),
      }));
      // Clear the location state to avoid reusing the table number
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToOrder = (product) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return {
          ...prevOrder,
          items: prevOrder.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...prevOrder,
        items: [...prevOrder.items, { ...product, quantity: 1 }],
      };
    });
  };

  const removeFromOrder = (productId) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.filter((item) => item.id !== productId),
    }));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  const calculateTotal = () => {
    return order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!order.table || order.items.length === 0) {
      alert("Por favor seleccione una mesa y agregue productos");
      return;
    }

    const newOrder = addOrder({
      ...order,
      total: calculateTotal(),
    });

    // Mark the table as active
    openTable(parseInt(order.table));

    console.log("Orden generada:", newOrder);
    setShowToast(true);
    setOrder({ table: "", items: [], notes: "" });
  };

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Éxito</strong>
        </Toast.Header>
        <Toast.Body>¡Comanda generada correctamente!</Toast.Body>
      </Toast>

      <h2 className="mb-4">Generar Comanda</h2>
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Buscar Productos</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o categoría..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>

              <ListGroup>
                {filteredProducts.map((product) => (
                  <ListGroup.Item
                    key={product.id}
                    className="d-flex justify-content-between align-items-center"
                    action
                    onClick={() => addToOrder(product)}
                  >
                    <div>
                      <h6 className="mb-0">{product.name}</h6>
                      <small className="text-muted">{product.category}</small>
                    </div>
                    <Badge bg="primary">${product.price.toFixed(2)}</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Mesa</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Número de mesa"
                    value={order.table}
                    onChange={(e) =>
                      setOrder({ ...order, table: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <h5 className="mb-3">Productos Seleccionados</h5>
                <ListGroup className="mb-3">
                  {order.items.map((item) => (
                    <ListGroup.Item
                      key={item.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </small>
                      </div>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => removeFromOrder(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <Form.Group className="mb-3">
                  <Form.Label>Notas</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={order.notes}
                    onChange={(e) =>
                      setOrder({ ...order, notes: e.target.value })
                    }
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Total:</h5>
                  <h5 className="mb-0">${calculateTotal().toFixed(2)}</h5>
                </div>

                <Button variant="primary" type="submit" className="w-100">
                  Generar Comanda
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Orders;
