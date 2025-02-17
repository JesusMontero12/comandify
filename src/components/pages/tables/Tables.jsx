import "./Tables.css";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { FaUtensils, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TablesContext } from "../../../context/TablesContext.jsx";

const Tables = () => {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  const { isTableActive } = useContext(TablesContext);
  const navigate = useNavigate();

  const handleNewOrder = (tableNumber) => {
    navigate("/orders", { state: { selectedTable: tableNumber } });
  };

  return (
    <>
      <h2 className="mb-4">Mesas</h2>
      <Row>
        {tables.map((table) => {
          const active = isTableActive(table);
          return (
            <Col key={table} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className={active ? "border-success" : ""}>
                <Card.Body className="text-center">
                  <div className="position-relative mb-3">
                    <FaUtensils
                      size={24}
                      className={active ? "text-success" : ""}
                    />
                    {active && (
                      <Badge
                        bg="success"
                        className="position-absolute top-0 start-100 translate-middle rounded-circle"
                      >
                        <FaCheck size={8} />
                      </Badge>
                    )}
                  </div>
                  <Card.Title>Mesa {table}</Card.Title>
                  <div className="mt-2">
                    {active ? (
                      <Badge bg="success" className="mb-2 d-block">
                        Mesa Abierta
                      </Badge>
                    ) : (
                      <Badge bg="secondary" className="mb-2 d-block">
                        Mesa Disponible
                      </Badge>
                    )}
                    <Button
                      variant={active ? "success" : "primary"}
                      onClick={() => handleNewOrder(table)}
                    >
                      {active ? "Agregar a Comanda" : "Nueva Comanda"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default Tables;
