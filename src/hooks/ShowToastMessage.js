import { useState } from "react";
import { Toast } from "react-bootstrap";

const ShowToastMessage = () => {
  const [toast, setToast] = useState({ show: false, message, status });

  const showToast = (message, status) => {
    setToast({ show: true, message, status });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: "true" }));
    }, 3000);
  };

  const ToastComponent = () => (
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

export default ShowToastMessage;
