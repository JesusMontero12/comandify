import "./TablesOrders.css";
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
import { FaMoneyBillTransfer } from "react-icons/fa6";

const TablesOrders = ({ data }) => {
  const {
    tables,
    isTableActive,
    products,
    selectedTable,
    setSelectedTable,
    showDetailsModal,
    setShowDetailsModal,
    showOrderModal,
    setShowOrderModal,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    modalTable,
    order,
    setOrder,
    filteredProduct,
    handleTableSelect,
    getTableOrders,
    handleCloseTable,
    addToOrder,
    removeFromOrder,
    updateQuantity,
    calculateTotal,
    handleSubmit,
    handleSearch,
    handleInputChange,
    total,
    subtotal,
  } = data;
  return (
    <>
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
                setOrder((prev) => ({
                  ...prev,
                  numeroMesa: modalTable.toString(),
                }));
                setShowDetailsModal(false);
                setShowOrderModal(true);
              }}
            >
              <FaPlus className="me-2" />
              Agregar Productos
            </Button>
          </div>
          {modalTable &&
            getTableOrders(modalTable).map((order, index) => (
              <Card key={order.id + index} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <h6>Orden #: {order.id}</h6>
                    <p>Fecha: {order.aperturaMesa}</p>
                  </div>
                  <ListGroup variant="flush">
                    {order.items.map((item, index) => (
                      <ListGroup.Item key={index}>
                        {item.cantidad}x {item.nombre} - ${" "}
                        {Number(item.precio * item.cantidad)
                          .toFixed(0)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className="mt-2">
                    <strong>
                      Total: ${" "}
                      {Number(order.subtotal)
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </strong>
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
            <Form.Group className="mb-3">
              <Form.Label>Descuento: {order.descuento} %</Form.Label>
              <Form.Range
                min={0}
                max={100}
                name="descuento"
                value={order.descuento}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Propina</Form.Label>
              <Form.Control
                type="num"
                name="propina"
                value={order.propina || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
            <h5>Método de Pago</h5>
            <div className="d-flex gap-2 mb-3">
              <Button
                variant={
                  selectedPaymentMethod === "efectivo"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedPaymentMethod("efectivo")}
              >
                <FaMoneyBill className="me-2" />
                Efectivo
              </Button>
              <Button
                variant={
                  selectedPaymentMethod === "tarjeta"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedPaymentMethod("tarjeta")}
              >
                <FaCreditCard className="me-2" />
                Tarjeta
              </Button>

              <Button
                variant={
                  selectedPaymentMethod === "transferencia"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setSelectedPaymentMethod("transferencia")}
              >
                <FaMoneyBillTransfer className="me-2" />
                Transferencia
              </Button>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-between">
            <div>
              <h5>Subtotal</h5>
              <h3>
                ${" "}
                {Number(subtotal)
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </h3>
            </div>
            <div>
              <h5>Total a Pagar</h5>
              <h3>
                ${" "}
                {Number(total)
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </h3>
            </div>
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
                onChange={handleSearch}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <ListGroup className="mb-3">
                    {(filteredProduct?.length > 0 ? filteredProduct : products)
                      ?.length > 0 ? (
                      (filteredProduct?.length > 0
                        ? filteredProduct
                        : products
                      ).map((product, index) => (
                        <ListGroup.Item
                          key={product?.id + index}
                          className={`d-flex justify-content-between align-items-center ${
                            product.estado === true ? "d-flex" : "disabled"
                          }`}
                          action
                          onClick={(e) => addToOrder(e, product)}
                        >
                          <div>
                            <h6 className="mb-0">{product.nombre}</h6>
                            <small className="text-muted">
                              Estado:{" "}
                              {product.estado === true ? "Activo" : "Inactivo"}
                            </small>
                          </div>
                          <Badge bg="primary">
                            ${Number(product.precio).toLocaleString("es-ES")}
                          </Badge>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <div>
                        <h6 className="mb-0">
                          No hay productos registrados en la base de datos.
                        </h6>
                      </div>
                    )}
                  </ListGroup>
                </div>
              </Col>

              <Col md={6}>
                <h5 className="mb-3">Productos Seleccionados</h5>
                <ListGroup className="mb-3">
                  {order.items.map((item, index) => (
                    <ListGroup.Item
                      key={item.id + index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-0">{item.nombre}</h6>
                        <small className="text-muted">
                          ${" "}
                          {Number(item.precio * item.cantidad)
                            .toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                          x {item.cantidad}
                        </small>
                      </div>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.cantidad - 1)
                          }
                          disabled={item.cantidad <= 1} // Evitar valores negativos
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.cantidad}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.cantidad + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => removeFromOrder(item.productId)}
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
                    value={order.notas}
                    onChange={(e) =>
                      setOrder({ ...order, notas: e.target.value })
                    }
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Total:</h5>
                  <h5 className="mb-0">
                    ${" "}
                    {calculateTotal()
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </h5>
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
                className={active ? "bg-primary" : "bg-success"}
                style={{
                  boxShadow:
                    "6px 6px 12px rgba(0, 0, 0, 0.4), inset 0px -4px 8px rgba(0, 0, 0, 0.3)",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  borderRadius: "12px",
                  cursor: "pointer",
                  padding: "10px",
                }}
                onClick={() => handleTableSelect(table)}
                onMouseEnter={(e) => {
                  (e.currentTarget.style.boxShadow =
                    "0px 8px 16px rgba(0, 0, 0, 0.3), inset 0px -2px 4px rgba(0, 0, 0, 0.4)"),
                    (e.currentTarget.style.transform = "scale(1.05)");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.style.boxShadow =
                    "6px 6px 12px rgba(0, 0, 0, 0.4), inset 0px -4px 8px rgba(0, 0, 0, 0.3)"),
                    (e.currentTarget.style.transform = "scale(1)");
                }}
              >
                <Card.Body
                  style={{
                    border: "1px solid white",
                    borderRadius: "12px",
                    padding: "5px",
                  }}
                  className="text-center"
                >
                  <div className="position-relative mb-3">
                    <FaUtensils size={24} className="text-light" />
                    {active && (
                      <Badge
                        bg="warning"
                        className="position-absolute top-0 start-100 translate-middle rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "18px", height: "18px", padding: "0" }} // Ajusta el tamaño del badge
                      >
                        <FaCheck size={10} className="d-block" />
                      </Badge>
                    )}
                  </div>
                  <Card.Title className="text-light">Mesa {table}</Card.Title>
                  <div className="mt-2 d-flex justify-content-center">
                    {active ? (
                      <Badge bg="warning" className="mb-2 d-block w-50">
                        Mesa Abierta
                      </Badge>
                    ) : (
                      <Badge bg="transparent" className="mb-2 d-block">
                        Mesa Disponible
                      </Badge>
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
