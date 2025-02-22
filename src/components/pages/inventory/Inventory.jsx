import "./Inventory.css";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  Toast,
  InputGroup,
  Placeholder,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const Inventory = ({ data }) => {
  const {
    showModal,
    inventory,
    newItem,
    removeIngredient,
    handleClose,
    handleShow,
    handleInputChange,
    handleSubmit,
    getStockStatus,
    handleEdit,
    handleSearch,
    filteredInventory,
    isEditing,
    loading,
  } = data;

  return (
    <>
      <h2 className="mb-4">Inventario</h2>
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6} className="mb-3 mb-md-0">
              <Button variant="primary" onClick={handleShow}>
                <FaPlus className="me-2" /> Agregar Item al Inventario
              </Button>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Buscar por nombre, proveedor o ubicación..."
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Stock Actual</th>
                <th>Cuadre Stock</th>
                <th>Estado</th>
                <th>Proveedor</th>
                <th>Costo Unitario</th>
                <th>Ubicación</th>
                <th>Vencimiento</th>
                <th>Actualizado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>

                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder.Button
                      xs={4}
                      className="m-1"
                      aria-hidden="true"
                    />
                    <Placeholder.Button
                      xs={4}
                      className="m-1"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              ) : filteredInventory.length > 0 ? (
                // Mostrar inventario filtrado si hay resultados
                filteredInventory.map((item, index) => (
                  <tr key={item.id + index}>
                    <td>{item.id.slice(0, 4) + "..."}</td>
                    <td>{item.nombre}</td>
                    <td>
                      {item.stockActual} {item.unidad}
                      <br />
                      <small className="text-muted">
                        Mín: {item.stockMinimo}
                      </small>
                    </td>
                    <td>
                      {(() => {
                        const stockTotal =
                          Number(item.stockConsumido) +
                          Number(item.stockActual);

                        const esValido =
                          Number(stockTotal) === Number(item.stockInicial);

                        const diferencia = Math.abs(
                          item.stockInicial - stockTotal
                        ); // Diferencia absoluta

                        return (
                          <Badge bg={esValido ? "success" : "danger"}>
                            {esValido ? "Ok" : `Descuadre (-${diferencia})`}
                          </Badge>
                        );
                      })()}
                    </td>

                    <td>{getStockStatus(item)}</td>
                    <td>{item.proveedor}</td>
                    <td>
                      $
                      {item.costoUnitario
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </td>
                    <td>{item.ubicacion}</td>
                    <td>{item.fechaVencimiento}</td>
                    <td>{item.fechaActualizacion}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeIngredient(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : inventory.length > 0 ? (
                // Mostrar inventario completo si no hay filtrado
                inventory.map((item, index) => (
                  <tr key={item.id + index}>
                    <td>{item.id.slice(0, 4) + "..."}</td>
                    <td>{item.nombre}</td>
                    <td>
                      {item.stockActual} {item.unidad}
                      <br />
                      <small className="text-muted">
                        Mín: {item.stockMinimo}
                      </small>
                    </td>
                    <td>
                      {(() => {
                        const stockTotal =
                          item.stockConsumido + item.stockActual;
                        const esValido = stockTotal === item.stockInicial;
                        const diferencia = Math.abs(
                          item.stockInicial - stockTotal
                        ); // Diferencia absoluta

                        return (
                          <Badge bg={esValido ? "success" : "danger"}>
                            {esValido ? "Ok" : `Descuadre (-${diferencia})`}
                          </Badge>
                        );
                      })()}
                    </td>

                    <td>{getStockStatus(item)}</td>
                    <td>{item.proveedor}</td>
                    <td>
                      $
                      {item.costoUnitario
                        .toFixed(0)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </td>
                    <td>{item.ubicacion}</td>
                    <td>{item.fechaVencimiento}</td>
                    <td>{item.fechaActualizacion}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeIngredient(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                // No hay inventario después de cargar
                <tr>
                  <td colSpan="10" className="text-center">
                    No hay inventario registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para agregar item al inventario */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing === true
              ? "Actualizar Inventario"
              : "Agregar Nuevo Item al Inventario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Producto*</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={newItem.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Proveedor*</Form.Label>
                  <Form.Control
                    type="text"
                    name="proveedor"
                    value={newItem.proveedor}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Inicial*</Form.Label>
                  <Form.Control
                    type="number"
                    name="stockInicial"
                    value={newItem.stockInicial}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Actual*</Form.Label>
                  <Form.Control
                    type="number"
                    name="stockActual"
                    value={newItem.stockActual}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Mínimo*</Form.Label>
                  <Form.Control
                    type="number"
                    name="stockMinimo"
                    value={newItem.stockMinimo}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad/Peso por Unidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="cantidadPeso"
                    value={newItem.cantidadPeso}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Unidad*</Form.Label>
                  <Form.Select
                    name="unidad"
                    value={newItem.unidad}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="unidad">Unidad</option>
                    <option value="g">Gramos</option>
                    <option value="kg">Kilogramos</option>
                    <option value="ml">Mililitros</option>
                    <option value="oz">Onza</option>
                    <option value="l">Litros</option>
                    <option value="rebanada">Rebanada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Costo Unitario*</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="costoUnitario"
                    value={newItem.costoUnitario}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    name="ubicacion"
                    value={newItem.ubicacion}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Ingreso*</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaIngreso"
                    value={newItem.fechaIngreso}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Vencimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaVencimiento"
                    value={newItem.fechaVencimiento}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              {isEditing === true ? (
                <Button variant="primary" type="submit">
                  Actualizar Item
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Guardar Item
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Inventory;
