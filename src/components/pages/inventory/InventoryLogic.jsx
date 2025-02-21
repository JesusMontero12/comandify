import Inventory from "./Inventory.jsx";
import { useContext, useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { InventoryContext } from "../../../context/InventoryContext.jsx";
import useToastMessage from "../../../hooks/useToastMessage.jsx";

const InventoryLogic = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [newItem, setNewItem] = useState({
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
  const { showToast, ToastComponent } = useToastMessage();
  const {
    inventory,
    fetchInventory,
    addIngredients,
    updateIngredient,
    removeIngredient,
    filterIngredients,
    filteredInventory,
  } = useContext(InventoryContext);

  // CARGA TODO EL INVENTARIO
  useEffect(() => {
    fetchInventory(); // Cargar inventario cuando se monta el componente
  }, []);

  // CIERRA LA VENTANA MODAL
  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewItem({
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

  // ABRE LA VENTANA MODAL
  const handleShow = () => setShowModal(true);

  // GUARDA LOS CAMBIOS DE LOS INPUTS EN EL ESTADO NEWITEM
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FUNCION PARA EDITAR INGREDIENTE
  const handleEdit = (item) => {
    setIsEditing(true);
    setNewItem({
      ...item,
      stockActual: item.stockActual.toString(),
      stockMinimo: item.stockMinimo.toString(),
      cantidadPeso: item.cantidadPeso?.toString() || "",
      costoUnitario: item.costoUnitario.toString(),
    });
    setShowModal(true);
  };

  // AVISA  SI EL STOCK ES CRITICO O NO
  const getStockStatus = (item) => {
    if (item.stockActual <= item.stockMinimo) {
      return <Badge bg="danger">Stock Bajo</Badge>;
    }
    if (item.stockActual <= item.stockMinimo * 1.5) {
      return <Badge bg="warning">Stock Medio</Badge>;
    }
    return <Badge bg="success">Stock OK</Badge>;
  };

  // FUNCION PARA ENVIAR LA CONSULTA AL CONTEXT Y EL CONTEXT A LA DB
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.nombre || !newItem.stockActual || !newItem.unidad) {
      showToast("Error", "Por favor complete los campos requeridos");
      return;
    }

    // Convertir valores numéricos antes de guardar
    const formattedItem = {
      ...newItem,
      stockActual: Number(newItem.stockActual),
      stockMinimo: Number(newItem.stockMinimo),
      cantidadPeso: Number(newItem.cantidadPeso),
      costoUnitario: Number(newItem.costoUnitario),
    };

    isEditing === true
      ? updateIngredient(formattedItem.id, formattedItem)
      : addIngredients(formattedItem);
    handleClose();
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    filterIngredients(query);
  };

  let data = {
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
    search,
    filteredInventory,
  };

  return (
    <>
      <Inventory data={data} />
    </>
  );
};

export default InventoryLogic;
