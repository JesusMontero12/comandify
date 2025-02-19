import { useState } from "react";
import Inventory from "./Inventory.jsx";
import { Badge } from "react-bootstrap";

const InventoryLogic = () => {
  const [showModal, setShowModal] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    id: "",
    nombre: "",
    stockActual: "",
    stockMinimo: "",
    proveedor: "",
    cantidadPeso: "",
    unidad: "",
    costoUnitario: "",
    fechaIngreso: "",
    fechaVencimiento: "",
    ubicacion: "",
  });

  const handleClose = () => {
    setShowModal(false);
    setNewItem({
      id: "",
      nombre: "",
      stockActual: "",
      stockMinimo: "",
      proveedor: "",
      cantidadPeso: "",
      unidad: "",
      costoUnitario: "",
      fechaIngreso: "",
      fechaVencimiento: "",
      ubicacion: "",
    });
  };

  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.nombre || !newItem.stockActual || !newItem.unidad) {
      alert("Por favor complete los campos requeridos");
      return;
    }

    const itemId = `${newItem.nombre
      .toLowerCase()
      .replace(/\s+/g, "_")}_${Date.now()}`;

    const itemToAdd = {
      ...newItem,
      id: itemId,
      stockActual: parseFloat(newItem.stockActual),
      stockMinimo: parseFloat(newItem.stockMinimo),
      costoUnitario: parseFloat(newItem.costoUnitario),
      cantidadPeso: parseFloat(newItem.cantidadPeso),
      fechaActualizacion: new Date().toISOString().split("T")[0],
    };

    setInventory((prev) => [...prev, itemToAdd]);
    inventory && setShowToast(true);
    handleClose();
  };

  const getStockStatus = (item) => {
    if (item.stockActual <= item.stockMinimo) {
      return <Badge bg="danger">Stock Bajo</Badge>;
    }
    if (item.stockActual <= item.stockMinimo * 1.5) {
      return <Badge bg="warning">Stock Medio</Badge>;
    }
    return <Badge bg="success">Stock OK</Badge>;
  };

  let data = {
    showToast,
    showModal,
    inventory,
    newItem,
    setShowToast,
    handleClose,
    handleShow,
    handleInputChange,
    handleSubmit,
    getStockStatus,
  };

  return (
    <>
      <Inventory data={data} />
    </>
  );
};

export default InventoryLogic;
