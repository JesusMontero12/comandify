import "./Products.css";
import { useState } from "react";
import {
  Form,
  Button,
  Table,
  Card,
  Row,
  Col,
  Modal,
  Badge,
  InputGroup,
  Placeholder,
} from "react-bootstrap";
import { FaPlus, FaPen, FaTrash, FaSearch } from "react-icons/fa";

const Products = ({ data }) => {
  const {
    showModal,
    products,
    inventory,
    newProduct,
    removeProduct,
    handleClose,
    handleShow,
    handleInputChange,
    handleIngredientChange,
    selectedIngredient,
    handleSubmit,
    handleEdit,
    handleSearch,
    filteredProduct,
    getIngredientName,
    addIngredient,
    removeIngredient,
    isEditing,
    loading,
  } = data;

  return (
    <>
      <h2 className="mb-4">Productos</h2>
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6} className="mb-3 mb-md-0">
              <Button variant="primary" onClick={handleShow}>
                <FaPlus className="me-2" /> Agregar Producto
              </Button>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Buscar por nombre"
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
                <th>Precio</th>
                <th>Descripción</th>
                <th>Proveedor</th>
                <th>Estado</th>
                <th>Ingredientes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? ( // Mientras se cargan los productos, muestra los placeholders
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
              ) : products.length > 0 ? ( // Si hay productos, renderiza la lista
                (filteredProduct.length > 0 ? filteredProduct : products).map(
                  (product, index) => {
                    const estadoValido = Boolean(JSON.parse(product.estado));
                    return (
                      <tr key={product.id + index}>
                        <td>{product.id.slice(0, 4) + "..."}</td>
                        <td>{product.nombre}</td>
                        <td>
                          $
                          {Number(product.precio)
                            .toFixed(0)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </td>
                        <td>{product.descripcion.slice(0, 10) + "..."}</td>
                        <td>{product.proveedor}</td>
                        <td>
                          <Badge bg={estadoValido ? "success" : "danger"}>
                            {estadoValido ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td>
                          <ul className="list-unstyled m-0">
                            {product.ingredientes.map((ing) => (
                              <li key={ing.id}>
                                * {getIngredientName(ing.id)} ({ing.cantidad}
                                {ing.unidad})
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(product)}
                          >
                            <FaPen />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                // Si no hay productos después de cargar, muestra el mensaje
                <tr>
                  <td colSpan="8" className="text-center">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para agregar producto */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing === true
              ? "Actualizar Producto"
              : "Agregar Nuevo Producto"}
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
                    value={newProduct.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio*</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precio"
                    value={newProduct.precio}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Proveedor</Form.Label>
                  <Form.Control
                    type="text"
                    name="proveedor"
                    value={newProduct.proveedor}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={newProduct.estado}
                    onChange={handleInputChange}
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={newProduct.descripcion}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Card className="mb-3">
              <Card.Body>
                <h5>Ingredientes</h5>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Seleccionar Ingrediente</Form.Label>
                      <Form.Select
                        name="id"
                        value={selectedIngredient.id}
                        onChange={handleIngredientChange}
                      >
                        <option value="">Seleccionar...</option>
                        {inventory.map((item, index) => (
                          <option key={item.id + index} value={item.id}>
                            {item.nombre} ({item.unidad})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cantidad</Form.Label>
                      <Form.Control
                        type="number"
                        name="cantidad"
                        value={selectedIngredient.cantidad}
                        onChange={handleIngredientChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="secondary" onClick={addIngredient}>
                  Agregar Ingrediente
                </Button>

                {newProduct.ingredientes.length > 0 && (
                  <div className="mt-3">
                    <h6>Ingredientes agregados:</h6>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Ingrediente</th>
                          <th>Cantidad</th>
                          <th>Unidad</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newProduct.ingredientes.map((ing) => (
                          <tr key={ing.id}>
                            <td>{getIngredientName(ing.id)}</td>
                            <td>{ing.cantidad}</td>
                            <td>{ing.unidad}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => removeIngredient(ing.id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>

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
                  Actualizar Producto
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Guardar Producto
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Products;
