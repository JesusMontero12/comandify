import { useState } from "react";
import { Toast } from "react-bootstrap";

const useToastMessage = () => {
  const [toast, setToast] = useState({ show: false, status: "", message: "" });

  const showToast = (status, message) => {
    setToast({ show: true, status, message });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const ToastComponent = () => (
    // 🔹 Esto debe ser una función que devuelva JSX
    <Toast
      show={toast.show}
      onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      delay={3000}
      autohide
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Toast.Header>
        <strong className="me-auto">
          {toast.status === "success" ? "✅ Éxito" : "⚠️ Error"}
        </strong>
      </Toast.Header>
      <Toast.Body>{toast.message}</Toast.Body>
    </Toast>
  );

  return { showToast, ToastComponent };
};

export default useToastMessage;
