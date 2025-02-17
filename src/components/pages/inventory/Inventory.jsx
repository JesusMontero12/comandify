import "./Inventory.css";
import { Table, Card, Button } from "react-bootstrap";

const Inventory = () => {
  return (
    <>
      <h2 className="mb-4">Inventario</h2>
      <Card>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Stock</th>
                <th>Unidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Pan de hamburguesa</td>
                <td>50</td>
                <td>unidades</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    Ajustar Stock
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default Inventory;
