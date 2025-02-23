import { createContext, useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import useToastMessage from "../hooks/useToastMessage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const { showToast, ToastComponent } = useToastMessage();

  useEffect(() => {
    fetchProduct();
  }, []);

  // FUNCION PAR MOSTRAR LOS PRODUCTOS
  const fetchProduct = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
      setFilteredProduct(data);
    } catch (error) {
      showToast(
        "Error",
        `Ocurrió un problema, intenta de nuevo o comunícate con soporte. \n${error}`
      );
    }
  };

  // FUNCION PARA REGISTRAR LOS PRODUCTOS
  const addProducts = async (product) => {
    try {
      const docRef = await addDoc(collection(db, "products"), product);
      showToast("success", `Registro exitoso con id: \n ${docRef.id}`);
      fetchProduct();
    } catch (error) {
      showToast(
        "error",
        `Ocurrió un problema, intenta de nuevo o comunícate con soporte. \n${error}`
      );
    }
  };

  // FUNCION PARA ACTUALIZAR LOS PRODUCTOS
  const updateProduct = async (productId, updatedData) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, updatedData);
      showToast("success", `Producto actualizado correctamente: ${productId}`);
      fetchProduct();
    } catch (error) {
      showToast("Error", `Error al actualizar el producto. \n${error}`);
    }
  };

  // FUNCION PARA ELIMINAR ALGUN PRODUCTO
  const removeProduct = async (idProduct) => {
    if (!idProduct) {
      showToast("error", "Error: Producto no encontrado.");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "products", idProduct));
          showToast("success", `Producto eliminado: ${idProduct}`);
          fetchProduct(); // Refrescar la lista de productos
        } catch (error) {
          showToast(
            "error",
            `Error al eliminar producto. Intenta de nuevo o comunícate con soporte. \n${error.message}`
          );
        }
      }
    });
  };

  // FUNCION PARA FILTRAR LOS PRODUCTOS
  const filterProducts = async (query = "") => {
    const lowerQuery = query.toLowerCase();

    const filtered = products.filter((item) => {
      return item.nombre.toLowerCase().includes(lowerQuery);
    });

    setFilteredProduct(filtered);
  };

  let data = {
    products,
    setProducts,
    filteredProduct,
    setFilteredProduct,
    fetchProduct,
    addProducts,
    updateProduct,
    removeProduct,
    filterProducts,
  };
  return (
    <ProductContext.Provider value={data}>
      {children}
      <ToastComponent />
    </ProductContext.Provider>
  );
};

export default ProductProvider;
