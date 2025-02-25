import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import useToastMessage from "../hooks/useToastMessage.jsx";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebaseConfig.js";
import { TablesContext } from "./TablesContext.jsx";
import { format } from "date-fns";
import es from "date-fns/locale/es";

export const OrdersContext = createContext();

const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const { setActiveTables } = useContext(TablesContext);
  const { showToast, ToastComponent } = useToastMessage();

  useEffect(() => {
    getOpenTables();
  }, []);

  // FUNCION QUE DEVUELVE LAS ORDER CON ESTADO (PENDIENTE)
  const getOpenTables = async () => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("estado", "==", "pendiente"), // Estado pendiente
        where("cierreMesa", "==", null) // No tiene fecha de cierre
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Actualiza el Set con las mesas abiertas
      const openTables = new Set(data.map((order) => order.numeroMesa));
      setActiveOrders(data);
      setActiveTables(openTables); // Actualiza el estado con las mesas activas
    } catch (error) {
      console.error("Error al obtener las mesas abiertas:", error);
    }
  };

  // FUNCION QUE REGISTRA Y/O ACTUALIZA LOS ITEMS DE LAS ORDENES
  const createOrder = async (order) => {
    try {
      const ordersRef = collection(db, "orders");

      // Buscar si ya hay una orden activa para la mesa
      const q = query(
        ordersRef,
        where("numeroMesa", "==", Number(order.numeroMesa)),
        where("estado", "==", "pendiente")
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Si ya existe una orden activa, actualizarla
        const existingOrderDoc = querySnapshot.docs[0];
        const existingOrder = existingOrderDoc.data();

        // Fusionar items: si el producto existe, aumentar cantidad; si no, agregarlo
        const updatedItems = [...existingOrder.items];

        order.items.forEach((newItem) => {
          const existingItemIndex = updatedItems.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex !== -1) {
            updatedItems[existingItemIndex].cantidad += newItem.cantidad;
          } else {
            updatedItems.push(newItem);
          }
        });

        // Actualizar la orden en Firestore
        await updateDoc(doc(db, "orders", existingOrderDoc.id), {
          items: updatedItems,
        });
        getOpenTables();

        showToast("success", "Orden actualizada correctamente.");
      } else {
        // Si no hay una orden abierta, crear una nueva
        const newOrder = {
          ...order,
          estado: "pendiente",
        };
        console.log(order);

        const docRef = await addDoc(ordersRef, newOrder);
        getOpenTables();
        showToast("success", `Nueva orden creada con ID: ${docRef.id}`);
      }
    } catch (error) {
      console.error("Error al actualizar/crear la orden:", error);
      showToast("error", `Error al guardar la orden: ${error.message}`);
    }
  };

  const updateOrderStatus = async (order, tableNumber, paymentMethod) => {
    try {
      const orderRef = doc(db, "orders", order.id);

      const cierreMesa = format(new Date(), "dd/MM/yyyy hh:mm a", {
        locale: es,
      });

      // Actualizamos la orden con todos los datos necesarios
      await updateDoc(orderRef, {
        ...order, // Copiamos todos los datos de la orden existente
        cierreMesa: cierreMesa, // Fecha de cierre
        estado: "cerrado", // Estado actualizado
        metodoPago: paymentMethod, // Método de pago
        ivaImpuesto: order.ivaImpuesto,
        propina: order.propina,
        subtotal: order.subtotal,
        total: order.total,
      });

      // Actualizamos el estado de la mesa en el conjunto de mesas activas
      setActiveTables((prevTables) => {
        const newTables = new Set(prevTables);
        newTables.delete(tableNumber);
        return newTables;
      });

      console.log(`Mesa ${tableNumber} cerrada con éxito.`);
    } catch (error) {
      console.error("Error al cerrar la mesa:", error);
    }
  };

  let data = { orders, createOrder, activeOrders, updateOrderStatus };
  return (
    <OrdersContext.Provider value={data}>
      {children}
      <ToastComponent />
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
