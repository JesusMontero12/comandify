export const productos = [
  {
    id: "hamburguesa_001",
    nombre: "Hamburguesa Clásica",
    precio: 10.99,
    descripcion: "Hamburguesa con carne de res, queso cheddar y pan artesanal.",
    proveedor: "BBC",
    estado: true,
    fechaRegistro: "2025-02-10",
    fechaActualizacion: "2025-02-10",
    ingredientes: [
      { id: "pan_001", cantidad: 1, unidad: "unidad" }, // 1 pan de hamburguesa
      { id: "carne_002", cantidad: 150, unidad: "g" }, // 150g de carne de res
      { id: "queso_003", cantidad: 1, unidad: "rebanada" }, // 1 rebanada de queso
    ],
  },
  {
    id: "hamburguesa_doble_002",
    nombre: "Hamburguesa Doble",
    precio: 14.99,
    descripcion: "Doble carne, doble queso, pan artesanal.",
    proveedor: "BBC",
    estado: true,
    fechaRegistro: "2025-02-10",
    fechaActualizacion: "2025-02-10",
    ingredientes: [
      { id: "pan_001", cantidad: 1, unidad: "unidad" }, // 1 pan de hamburguesa
      { id: "carne_002", cantidad: 300, unidad: "g" }, // 300g de carne de res (doble)
      { id: "queso_003", cantidad: 2, unidad: "rebanada" }, // 2 rebanadas de queso cheddar
    ],
  },
];

export const inventario = [
  {
    id: "pan_001",
    nombre: "Pan de hamburguesa",
    proveedor: "Panadería El Buen Sabor",
    stockActual: 100, // 100 unidades en stock
    stockMinimo: 20, // Mínimo antes de alertar
    cantidadPeso: "1",
    unidad: "unidad",
    costoUnitario: 0.5, // Precio por unidad
    ubicacion: "Estante A - Sección 1",
    fechaIngreso: "2025-02-10",
    fechaVencimiento: "2025-03-10",
    fechaActualizacion: "2025-02-10",
  },
  {
    id: "carne_002",
    nombre: "Carne de res",
    proveedor: "Carnicería Don Pedro",
    stockActual: 5000, // 5000 gramos (5kg)
    stockMinimo: 1000, // Si baja de 1kg, alerta
    cantidadPeso: "150",
    unidad: "g",
    costoUnitario: 0.05, // Precio por gramo
    ubicacion: "Refrigerador - Sección 3",
    fechaIngreso: "2025-02-12",
    fechaVencimiento: "2025-02-22",
    fechaActualizacion: "2025-02-10",
  },
  {
    id: "queso_003",
    nombre: "Queso cheddar",
    proveedor: "Lácteos La Vaca Feliz",
    stockActual: 50, // 50 rebanadas
    stockMinimo: 10,
    cantidadPeso: "3",
    unidad: "rebanada",
    costoUnitario: 0.3, // Precio por rebanada
    ubicacion: "Refrigerador - Sección 2",
    fechaIngreso: "2025-02-15",
    fechaVencimiento: "2025-03-05",
    fechaActualizacion: "2025-02-10",
  },
];

export const orders = [
  {
    numeroMesa: 5,
    estado: "open",
    aperturaMesa: "2025-02-23T14:30:00Z",
    cierreMesa: null,
    items: [
      {
        productId: "abc123",
        name: "Hamburguesa Clásica",
        quantity: 2,
        unitPrice: 8500,
        totalPrice: 17000,
        notes: "Sin cebolla",
        ingredientsDeducted: [
          {
            ingredientId: "ing567",
            name: "Pan de hamburguesa",
            quantityDeducted: 2,
          },
          {
            ingredientId: "ing890",
            name: "Carne de res",
            quantityDeducted: 2,
          },
        ],
      },
      {
        productId: "xyz789",
        name: "Papas Fritas",
        quantity: 1,
        unitPrice: 5000,
        totalPrice: 5000,
        notes: "Con extra queso",
        ingredientsDeducted: [
          {
            ingredientId: "ing567",
            name: "Pan de hamburguesa",
            quantityDeducted: 2,
          },
          {
            ingredientId: "ing890",
            name: "Carne de res",
            quantityDeducted: 2,
          },
        ],
      },
    ],
    subtotal: 22000,
    descuento: 2000,
    total: 20000,
    metodoPago: "Efectivo",
    propina: 2000,
    grandTotal: 22000,
    mesero: {
      id: "waiter001",
      name: "Juan Pérez",
    },
    cliente: {
      id: "customer123",
      name: "Cliente Frecuente",
      phone: "+56912345678",
    },
    ivaImpuesto: 1900,
  },
];
