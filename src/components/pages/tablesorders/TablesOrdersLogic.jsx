import TablesOrders from "./TablesOrders.jsx";
import { TablesContext } from "../../../context/TablesContext.jsx";
import { ProductContext } from "../../../context/ProductContext.jsx";
import { OrdersContext } from "../../../context/OrdersContext.jsx";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import es from "date-fns/locale/es";

const TablesOrdersLogic = () => {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  const { isTableActive, openTable, closeTable, activeTables } =
    useContext(TablesContext);
  const { products, filterProducts, filteredProduct, fetchProduct } =
    useContext(ProductContext);
  const { createOrder, activeOrders, updateOrderStatus } =
    useContext(OrdersContext);

  const [rangeValue, setRangeValue] = useState(0);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [modalTable, setModalTable] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState({
    numeroMesa: 0,
    estado: "",
    aperturaMesa: "",
    cierreMesa: null,
    items: [
      {
        productId: "",
        nomre: "",
        cantidad: 0,
        precioUnitario: 0,
        precioTotal: 0,
        notas: "",
        ingredientesDescontado: [
          {
            ingredientId: "",
            nombre: "",
            cantidadDescontado: 0,
          },
        ],
      },
    ],
    subtotal: 0,
    descuento: 0,
    total: 0,
    metodoPago: "",
    propina: 0,
    mesero: {
      id: "",
      nombre: "",
    },
    cliente: {
      id: "",
      nombre: "",
      telefono: "",
    },
    ivaImpuesto: 0,
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleTableSelect = async (tableNumber) => {
    fetchProduct(); // Cargar productos primero

    if (activeTables.has(tableNumber)) {
      // Buscar la orden activa para la mesa seleccionada
      const activeOrder = activeOrders.find(
        (order) => order.numeroMesa === tableNumber
      );

      if (activeOrder) {
        setOrder({
          ...activeOrder,
          propina: activeOrder.propina || 0, // Evitar valores undefined
          descuento: activeOrder.descuento || 0, // Evitar valores undefined
        });

        setModalTable(tableNumber);
        setShowDetailsModal(true);
      }
    } else {
      // Si la mesa no está activa, iniciar una nueva orden
      setSelectedTable(tableNumber);
      setOrder({
        ...order,
        numeroMesa: tableNumber,
        aperturaMesa: format(new Date(), "dd/MM/yyyy hh:mm a", { locale: es }),
        estado: "abierto",
        items: [],
        propina: 0,
        descuento: 0,
      });

      setShowOrderModal(true);
    }

    // Obtener las órdenes actualizadas de la mesa seleccionada
    const updatedOrders = getTableOrders(tableNumber) || []; // Asegurar que siempre sea un array

    // Calcular subtotal y total si hay órdenes
    const newSubtotal =
      updatedOrders.length > 0 ? calculateTableSubtotal(updatedOrders) : 0;
    const newTotal =
      updatedOrders.length > 0 ? calculateTableTotal(updatedOrders) : 0;

    // Actualizar estados de subtotal y total
    setSubtotal(newSubtotal);
    setTotal(newTotal);
  };

  const getTableOrders = (tableNumber) => {
    return activeOrders?.filter(
      (order) =>
        Number(order.numeroMesa) === Number(tableNumber) &&
        order.estado !== "cerrado"
    );
  };

  const calculateTableSubtotal = (tableOrders) => {
    return tableOrders.reduce(
      (subtotal, order) => subtotal + (order.subtotal || 0),
      0
    );
  };

  const calculateTableTotal = (tableOrders) => {
    // Verificar si tableOrders es un array
    if (!Array.isArray(tableOrders)) {
      console.error("Error: tableOrders no es un array", tableOrders);
      return 0; // Si no es un array, retornar 0
    }

    return tableOrders.reduce(
      (total, order) =>
        total +
        (order.subtotal || 0) +
        (order.propina || 0) -
        ((order.subtotal || 0) * (order.descuento || 0)) / 100,
      0
    );
  };

  const handleCloseTable = () => {
    if (!selectedPaymentMethod) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor seleccione un método de pago.",
      });
      return;
    }

    const tableOrders = getTableOrders(modalTable);

    tableOrders.forEach((order) => {
      updateOrderStatus(order, modalTable, selectedPaymentMethod); // ✅ Pasamos toda la orden
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
        // Si el item ya existe, solo incrementamos la cantidad
        return {
          ...prevOrder,
          items: prevOrder.items.map((item) =>
            item.id === product.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        };
      }

      // Si el item no existe, lo agregamos
      return {
        ...prevOrder,
        items: [...prevOrder.items, { ...product, cantidad: 1 }],
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
        item.id === productId ? { ...item, cantidad: newQuantity } : item
      ),
    }));
  };

  const calculateTotal = () => {
    return order.items.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  };

  // GUARDA LOS CAMBIOS DE LOS INPUTS EN EL ESTADO NEWITEM
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setOrder((prevOrder) => {
      const updatedValue = Number(value) || 0;

      const updatedOrder = {
        ...prevOrder,
        [name]: updatedValue,
      };

      console.log("Orden actualizada:", updatedOrder);

      // Verificar si modalTable está definido
      if (!modalTable) {
        console.error("Error: modalTable no está definido.");
        return prevOrder;
      }

      const updatedOrders = (getTableOrders(modalTable) || []).map((order) =>
        order.numeroMesa === modalTable ? updatedOrder : order
      );

      console.log("Órdenes actualizadas:", updatedOrders);

      // Calcular los nuevos valores
      const newSubtotal = calculateTableSubtotal(updatedOrders);
      console.log("Nuevo subtotal:", newSubtotal);

      const newTotal = calculateTableTotal(
        updatedOrders,
        updatedOrder.propina,
        updatedOrder.descuento
      );
      console.log("Nuevo total:", newTotal);

      // Actualizar estados
      setSubtotal(newSubtotal);
      setTotal(newTotal);

      return updatedOrder;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!order.numeroMesa || order.items.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor agregue productos a la orden.",
      });
      return;
    }

    // Asegúrate de que 'notas' tenga un valor por defecto (vacío si no está definido)
    const updatedOrder = {
      ...order,
      notas: order.notas || "",
      descuento: 0,
      subtotal: calculateTotal(),
    };

    try {
      await createOrder(updatedOrder);
      openTable(Number(order.numeroMesa));

      Swal.fire({
        icon: "success",
        title: "Ok...",
        text: "Comanda actualizada correctamente.",
      });

      setShowOrderModal(false);

      // Reset order
      setOrder({
        numeroMesa: 0,
        estado: "",
        notas: "",
        aperturaMesa: "",
        cierreMesa: null,
        items: [],
        subtotal: 0,
        descuento: 0,
        total: 0,
        metodoPago: "",
        propina: 0,
        mesero: { id: "", nombre: "" },
        cliente: { id: "", nombre: "", telefono: "" },
        ivaImpuesto: 0,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Hubo un error al crear/actualizar la orden. Intenta nuevamente.",
      });
    }
  };

  // FUNCION PARA FILTRAR PRODUCTOS
  const handleSearch = (event) => {
    const query = event.target.value;
    filterProducts(query);
  };

  let data = {
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
    calculateTableSubtotal,
    calculateTableTotal,
    handleCloseTable,
    addToOrder,
    removeFromOrder,
    updateQuantity,
    calculateTotal,
    handleSubmit,
    handleSearch,
    rangeValue,
    setRangeValue,
    handleInputChange,
    total,
    subtotal,
  };

  return (
    <>
      <TablesOrders data={data} />
    </>
  );
};

export default TablesOrdersLogic;
