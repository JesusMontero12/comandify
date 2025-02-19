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
} from "react-bootstrap";
import { FaPlus, FaPen, FaTrash } from "react-icons/fa";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    nombre: "",
    precio: "",
    descripcion: "",
    proveedor: "",
    estado: true,
    ingredientes: [],
  });

  // Simulación de inventario (esto debería venir del contexto o props)
  const [inventory] = useState([
    { id: "pan_001", nombre: "Pan de hamburguesa", unidad: "unidad" },
    { id: "carne_002", nombre: "Carne de res", unidad: "g" },
    { id: "queso_003", nombre: "Queso cheddar", unidad: "rebanada" },
  ]);

  const [selectedIngredient, setSelectedIngredient] = useState({
    id: "",
    cantidad: "",
  });

  const handleClose = () => {
    setShowModal(false);
    setNewProduct({
      id: "",
      nombre: "",
      precio: "",
      descripcion: "",
      proveedor: "",
      estado: true,
      ingredientes: [],
    });
    setSelectedIngredient({ id: "", cantidad: "" });
  };

  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    setSelectedIngredient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addIngredient = () => {
    if (!selectedIngredient.id || !selectedIngredient.cantidad) {
      alert("Por favor seleccione un ingrediente y especifique la cantidad");
      return;
    }

    const ingredientFromInventory = inventory.find(
      (item) => item.id === selectedIngredient.id
    );

    if (!ingredientFromInventory) return;

    const newIngredient = {
      id: selectedIngredient.id,
      cantidad: parseFloat(selectedIngredient.cantidad),
      unidad: ingredientFromInventory.unidad,
    };

    // Verificar si el ingrediente ya existe
    if (newProduct.ingredientes.some((ing) => ing.id === newIngredient.id)) {
      alert("Este ingrediente ya ha sido agregado");
      return;
    }

    setNewProduct((prev) => ({
      ...prev,
      ingredientes: [...prev.ingredientes, newIngredient],
    }));

    setSelectedIngredient({ id: "", cantidad: "" });
  };

  const removeIngredient = (ingredientId) => {
    setNewProduct((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((ing) => ing.id !== ingredientId),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newProduct.nombre ||
      !newProduct.precio ||
      newProduct.ingredientes.length === 0
    ) {
      alert(
        "Por favor complete todos los campos requeridos y agregue al menos un ingrediente"
      );
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: `${newProduct.nombre
        .toLowerCase()
        .replace(/\s+/g, "_")}_${Date.now()}`,
      precio: parseFloat(newProduct.precio),
      fechaRegistro: new Date().toISOString().split("T")[0],
      fechaActualizacion: new Date().toISOString().split("T")[0],
    };

    setProducts((prev) => [...prev, productToAdd]);
    handleClose();
  };

  const getIngredientName = (id) => {
    const ingredient = inventory.find((item) => item.id === id);
    return ingredient ? ingredient.nombre : id;
  };

  return (
    <>
      <h2 className="mb-4">Productos</h2>
      <Card className="mb-4">
        <Card.Body>
          <Button variant="primary" onClick={handleShow}>
            <FaPlus className="me-2" /> Agregar Producto
          </Button>
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
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.nombre}</td>
                  <td>${product.precio.toFixed(2)}</td>
                  <td>{product.descripcion}</td>
                  <td>{product.proveedor}</td>
                  <td>
                    <Badge bg={product.estado ? "success" : "danger"}>
                      {product.estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td>
                    <ul className="list-unstyled m-0">
                      {product.ingredientes.map((ing) => (
                        <li key={ing.id}>
                          {getIngredientName(ing.id)} ({ing.cantidad}{" "}
                          {ing.unidad})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2">
                      <FaPen />
                    </Button>
                    <Button variant="danger" size="sm">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para agregar producto */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Producto</Modal.Title>
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
                        {inventory.map((item) => (
                          <option key={item.id} value={item.id}>
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
              <Button variant="primary" type="submit">
                Guardar Producto
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Products;
