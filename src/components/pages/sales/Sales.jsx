import "./Sales.css";
import { Table, Card, Badge } from "react-bootstrap";
import { useContext } from "react";
import { OrdersContext } from "../../../context/OrdersContext";

const Sales = () => {
  const { orders } = useContext(OrdersContext);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("es-ES", options);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      completed: "success",
      cancelled: "danger",
    };
    return (
      <Badge bg={variants[status] || "secondary"}>
        {status === "pending"
          ? "Pendiente"
          : status === "completed"
          ? "Completado"
          : status === "cancelled"
          ? "Cancelado"
          : status}
      </Badge>
    );
  };

  return (
    <>
      <h2 className="mb-4">Ventas</h2>
      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Mesa</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>Mesa {order.table}</td>
                  <td>
                    <ul className="list-unstyled m-0">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.name} (${item.price.toFixed(2)}
                          )
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{order.notes || "-"}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No hay ventas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default Sales;
