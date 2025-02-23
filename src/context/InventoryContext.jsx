import { createContext, useEffect, useState } from "react";
import useToastMessage from "../hooks/useToastMessage.jsx";
import { db } from "../firebaseConfig.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

export const InventoryContext = createContext();

const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const { showToast, ToastComponent } = useToastMessage();

  useEffect(() => {
    fetchInventory();
  }, []);

  //   FUNCION PARA MOSTRAR EL INVENTARIO
  const fetchInventory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(data);
      setFilteredInventory(data);
    } catch (error) {
      showToast(
        "Error",
        `Ocurrió un problema, intenta de nuevo o comunícate con soporte. \n${error}`
      );
    }
  };

  //   FUNCION PARA AGREGAR INGREDIENTES AL INVENTARIO
  const addIngredients = async (ingredients) => {
    try {
      const docRef = await addDoc(collection(db, "inventory"), ingredients);
      showToast("success", `Registro exitoso con id: \n ${docRef.id}`);
      fetchInventory(); // Refrescar datos
    } catch (error) {
      showToast(
        "Error",
        `Ocurrió un problema, intenta de nuevo o comunícate con soporte. \n${error}`
      );
    }
  };

  //   FUNCION PARA ACTUALIZAR LOS DATOS DEL INGREDIENTE
  const updateIngredient = async (ingredientId, updatedData) => {
    try {
      const ingredientRef = doc(db, "inventory", ingredientId);
      await updateDoc(ingredientRef, updatedData);
      showToast(
        "success",
        `Ingrediente actualizado correctamente: ${ingredientId}`
      );
      fetchInventory(); // Refrescar datos
    } catch (error) {
      showToast("Error", `Error al actualizar el ingrediente. \n${error}`);
    }
  };

  // FUNCION PARA ELIMINAR ALGUN INGREDIENTE DEL INVENTARIO
  const removeIngredient = async (idIngrediente) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "inventory", idIngrediente));
        showToast("success", `Ingrediente eliminado: ${idIngrediente}`);
        fetchInventory(); // Refrescar datos
      } catch (error) {
        showToast(
          "error",
          `Error al eliminar ingrediente, intenta de nuevo o comunícate con soporte. \n${error}`
        );
      }
    }
  };

  // FUNCION PARA FILTRAR LOS INGREDIENTES
  const filterIngredients = (query = "") => {
    const lowerQuery = query.toLowerCase();

    const filtered = inventory.filter((item) => {
      return item.nombre.toLowerCase().includes(lowerQuery);
    });

    setFilteredInventory(filtered);
  };

  let data = {
    inventory,
    setInventory,
    fetchInventory,
    addIngredients,
    updateIngredient,
    removeIngredient,
    filterIngredients,
    filteredInventory,
  };

  return (
    <InventoryContext.Provider value={data}>
      {children}
      <ToastComponent />
    </InventoryContext.Provider>
  );
};

export default InventoryProvider;
