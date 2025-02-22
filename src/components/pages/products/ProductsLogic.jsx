import { useContext, useEffect, useState } from "react";
import Products from "./Products.jsx";
import { InventoryContext } from "../../../context/InventoryContext.jsx";
import useToastMessage from "../../../hooks/useToastMessage.jsx";
import { ProductContext } from "../../../context/ProductContext.jsx";
import Swal from "sweetalert2";

const ProductsLogic = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    proveedor: "",
    estado: true,
    ingredientes: [],
  });
  const { showToast, ToastComponent } = useToastMessage();
  const {
    products,
    setProducts,
    filteredProduct,
    setFilteredProduct,
    fetchProduct,
    addProducts,
    updateProduct,
    removeProduct,
    filterProducts,
  } = useContext(ProductContext);
  const { inventory } = useContext(InventoryContext);
  const [selectedIngredient, setSelectedIngredient] = useState({
    id: "",
    cantidad: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); 

    setTimeout(() => {
      fetchProduct();
      setProducts(fetchProduct);
      setLoading(false); 
    }, 2000);
  }, []);

  // CIERRA LA VENTANA MODAL
  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewProduct({
      nombre: "",
      precio: "",
      descripcion: "",
      proveedor: "",
      estado: true,
      ingredientes: [],
    });
    setSelectedIngredient({ id: "", cantidad: "" });
  };

  // ABRE LA VENTANA MODAL
  const handleShow = () => setShowModal(true);

  // GUARDA LOS CAMBIOS DE LOS INPUTS EN EL ESTADO NEWITEM
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FUNCION PARA EDITAR PRODUCT
  const handleEdit = (item) => {
    setIsEditing(true);
    setNewProduct({
      ...item,
      nombre: item.nombre.toString(),
      precio: item.precio.toString(),
      descripcion: item.descripcion.toString(),
      proveedor: item.proveedor.toString(),
      estado: item.estado.toString(),
      ingredientes: item.ingredientes,
    });
    setShowModal(true);
  };

  // FUNCION PARA AGREGAR INGREDIENTES AL PRODUCTO
  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    setSelectedIngredient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FUNCION PARA ENVIAR LA CONSULTA AL CONTEXT Y EL CONTEXT A LA DB
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newProduct.nombre ||
      !newProduct.precio ||
      newProduct.ingredientes.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor complete los campos requeridos.",
      });
      return;
    }

    const productToAdd = {
      ...newProduct,
      precio: Number(newProduct.precio),
      ...(isEditing === false && {
        fechaRegistro: new Date().toISOString().split("T")[0],
      }),
      fechaActualizacion: new Date().toISOString().split("T")[0],
    };

    isEditing === true
      ? updateProduct(productToAdd.id, productToAdd)
      : addProducts(productToAdd);
    handleClose();
  };

  // FUNCION PARA FILTRAR PRODUCTOS
  const handleSearch = (event) => {
    const query = event.target.value;
    filterProducts(query);
  };

  // FUNCION PARA MOSTRAR LOS ITEMS DE INVENTARIO
  const getIngredientName = (id) => {
    const ingredient = inventory.find((item) => item.id === id);
    return ingredient ? ingredient.nombre : id;
  };

  const addIngredient = () => {
    if (!selectedIngredient.id || !selectedIngredient.cantidad) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor seleccione un ingrediente y especifique la cantidad.",
      });
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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Este ingrediente ya ha sido agregado.",
      });
      return;
    }

    setNewProduct((prev) => ({
      ...prev,
      ingredientes: [...prev.ingredientes, newIngredient],
    }));

    setSelectedIngredient({ id: "", cantidad: "" });
  };

  const removeIngredient = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Se quitará de la lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quitar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setNewProduct((prev) => ({
          ...prev,
          ingredientes: prev.ingredientes.filter((ing) => ing.id !== id),
        }));
      }
    });
  };

  let data = {
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
  };
  return (
    <>
      <Products data={data} />
    </>
  );
};

export default ProductsLogic;
