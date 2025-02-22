import "./TablesOrders.css";
import { useContext, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Form,
  ListGroup,
  Modal,
  Toast,
} from "react-bootstrap";
import {
  FaUtensils,
  FaCheck,
  FaTrash,
  FaMoneyBill,
  FaCreditCard,
  FaPlus,
} from "react-icons/fa";
import { TablesContext } from "../../../context/TablesContext";
import { ProductContext } from "../../../context/ProductContext";
import { OrdersContext } from "../../../context/OrdersContext";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const TablesOrders = () => {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  const { isTableActive, openTable, closeTable } = useContext(TablesContext);
  const { products } = useContext(ProductContext);
  const { orders, addOrder, updateOrderStatus } = useContext(OrdersContext);

  const [selectedTable, setSelectedTable] = useState(null);
  const [search, setSearch] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [modalTable, setModalTable] = useState(null);
  const [order, setOrder] = useState({
    table: "",
    items: [],
    notes: "",
  });

  const filteredProducts = products?.filter(
    (product) =>
      (product?.name?.toLowerCase() ?? "").includes(search?.toLowerCase()) ||
      (Array.isArray(product?.category)
        ? product.category.join(" ").toLowerCase()
        : product?.category?.toLowerCase() ?? ""
      ).includes(search?.toLowerCase())
  );

  const handleTableSelect = (tableNumber) => {
    if (isTableActive(tableNumber)) {
      setModalTable(tableNumber);
      setShowDetailsModal(true);
    } else {
      setSelectedTable(tableNumber);
      setOrder((prev) => ({
        ...prev,
        table: tableNumber.toString(),
        items: [],
      }));
      setShowOrderModal(true);
    }
  };

  const getTableOrders = (tableNumber) => {
    return orders.filter(
      (order) =>
        order.table === tableNumber?.toString() && order.status !== "completed"
    );
  };

  const calculateTableTotal = (tableOrders) => {
    return tableOrders.reduce((total, order) => total + order.total, 0);
  };

  const handleCloseTable = () => {
    if (!selectedPaymentMethod) {
      alert("Por favor seleccione un método de pago");
      return;
    }

    const tableOrders = getTableOrders(modalTable);
    tableOrders.forEach((order) => {
      updateOrderStatus(order.id, "completed", selectedPaymentMethod);
    });

    closeTable(modalTable);
    setShowDetailsModal(false);
    setSelectedPaymentMethod("");
    setModalTable(null);
  };

  const addToOrder = (e, product) => {
    e.preventDefault();
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
      alert("Por favor agregue productos a la orden");
      return;
    }

    const newOrder = addOrder({
      ...order,
      total: calculateTotal(),
    });

    openTable(parseInt(order.table));
    setShowToast(true);
    setShowOrderModal(false);

    // Reset order
    setOrder({
      table: "",
      items: [],
      notes: "",
    });
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
          <strong className="me-auto">¡Éxito!</strong>
        </Toast.Header>
        <Toast.Body>Comanda generada correctamente</Toast.Body>
      </Toast>

      {/* Modal para detalles de mesa y pago */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Mesa {modalTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Órdenes Activas</h5>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedTable(modalTable);
                setOrder((prev) => ({ ...prev, table: modalTable.toString() }));
                setShowDetailsModal(false);
                setShowOrderModal(true);
              }}
            >
              <FaPlus className="me-2" />
              Agregar Productos
            </Button>
          </div>
          {modalTable &&
            getTableOrders(modalTable).map((order) => (
              <Card key={order.id} className="mb-3">
                <Card.Body>
                  <h6>Orden #{order.id}</h6>
                  <ListGroup variant="flush">
                    {order.items.map((item, index) => (
                      <ListGroup.Item key={index}>
                        {item.quantity}x {item.name} - $
                        {(item.price * item.quantity).toFixed(2)}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className="mt-2">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                  {order.notes && (
                    <div className="mt-2">
                      <small className="text-muted">Notas: {order.notes}</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}

          <div className="mt-4">
            <h5>Método de Pago</h5>
            <div className="d-flex gap-2 mb-3">
              <Button
                variant={
                  selectedPaymentMethod === "cash"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedPaymentMethod("cash")}
              >
                <FaMoneyBill className="me-2" />
                Efectivo
              </Button>
              <Button
                variant={
                  selectedPaymentMethod === "card"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedPaymentMethod("card")}
              >
                <FaCreditCard className="me-2" />
                Tarjeta
              </Button>

              <Button
                variant={
                  selectedPaymentMethod === "transfer"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedPaymentMethod("transfer")}
              >
                <FaMoneyBillTransfer className="me-2" />
                Transferencia
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <h5>Total a Pagar</h5>
            <h3>
              ${calculateTableTotal(getTableOrders(modalTable)).toFixed(2)}
            </h3>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Cerrar
          </Button>
          <Button variant="success" onClick={handleCloseTable}>
            Procesar Pago y Cerrar Mesa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear nueva orden */}
      <Modal
        show={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nueva Comanda - Mesa {selectedTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Buscar Productos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <ListGroup className="mb-3">
                  {filteredProducts.length > 0
                    ? filteredProducts.map((product) => (
                        <ListGroup.Item
                          key={product.id}
                          className="d-flex justify-content-between align-items-center"
                          action
                          onClick={(e) => addToOrder(e, product)}
                        >
                          <div>
                            <h6 className="mb-0">{product.name}</h6>
                            <small className="text-muted">
                              {product.category}
                            </small>
                          </div>
                          <Badge bg="primary">
                            $
                            {Number(product.price)
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                          </Badge>
                        </ListGroup.Item>
                      ))
                    : products?.map((product) => {
                        <ListGroup.Item
                          key={product.id}
                          className="d-flex justify-content-between align-items-center"
                          action
                          onClick={(e) => addToOrder(e, product)}
                        >
                          <div>
                            <h6 className="mb-0">{product.name}</h6>
                            <small className="text-muted">
                              {product.category}
                            </small>
                          </div>
                          <Badge bg="primary">
                            $
                            {Number(product.price)
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                          </Badge>
                        </ListGroup.Item>;
                      })}
                </ListGroup>
              </Col>

              <Col md={6}>
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
                          $
                          {Number(item.price)
                            .toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                          x {item.quantity}
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
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Generar Comanda
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 className="mb-4">Mesas y Comandas</h2>
      <Row>
        {tables.map((table) => {
          const active = isTableActive(table);
          return (
            <Col key={table} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className={`${
                  active ? "border-warning" : "border-success"
                } cursor-pointer`}
                onClick={() => handleTableSelect(table)}
              >
                <Card.Body className="text-center">
                  <div className="position-relative mb-3">
                    <FaUtensils
                      size={24}
                      className={active ? "text-warning" : ""}
                    />
                    {active && (
                      <Badge
                        bg="warning"
                        className="position-absolute top-0 start-100 translate-middle rounded-circle"
                      >
                        <FaCheck size={8} />
                      </Badge>
                    )}
                  </div>
                  <Card.Title>Mesa {table}</Card.Title>
                  <div className="mt-2">
                    {active ? (
                      <Badge bg="warning" className="mb-2 d-block">
                        Mesa Abierta
                      </Badge>
                    ) : (
                      <Badge bg="success" className="mb-2 d-block">
                        Mesa Disponible
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    {active && (
                      <Button
                        variant="warning"
                        className="text-white"
                        onClick={() => setShowDetailsModal(true)}
                      >
                        Detalle
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default TablesOrders;
