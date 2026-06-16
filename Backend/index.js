require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg'); 
const { PrismaPg } = require('@prisma/adapter-pg'); 
const bcrypt = require('bcryptjs');

// conexión adaptador requerido para Prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

//Rutas
// Obtener productos (Home del Comprador)
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { seller: { select: { name: true } } }, // Trae también el nombre del vendedor
      orderBy: { id: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar productos" });
  }
});

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, 
      },
    });

    res.json({ message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    
    if (error.code === 'P2002') {
      res.status(400).json({ error: "Este correo ya está registrado." });
    } else {
      res.status(500).json({ error: "Error al registrar el usuario." });
    }
  }
});

//Inicio de sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    
    const { password: _, ...userData } = user;

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor." });
  }
});

//Publicar producti
app.post('/api/products', async (req, res) => {
  // Recibir datos que envía React
  const { sellerId, title, description, price, stock, location, imageUrl } = req.body;

  try {
    // nuevo registro en Product
    const newProduct = await prisma.product.create({
      data: {
        sellerId: parseInt(sellerId), 
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        location,
        imageUrl: imageUrl || "https://via.placeholder.com/300x200?text=Sin+Imagen", // Imagen por defecto si no suben una
      },
    });

    res.json({ message: "Producto publicado exitosamente", product: newProduct });
  } catch (error) {
    console.error("Error al guardar producto:", error);
    res.status(500).json({ error: "Hubo un problema al publicar el producto." });
  }
});

//Reseñas de producto
app.get('/api/products/:id/reviews', async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(id) },
      include: { buyer: { select: { name: true } } }, 
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar reseñas" });
  }
});

//publicar reseña
app.post('/api/reviews', async (req, res) => {
  const { productId, buyerId, rating, comment, reviewImageUrl } = req.body;
  try {
    const newReview = await prisma.review.create({
      data: {
        productId: parseInt(productId),
        buyerId: parseInt(buyerId),
        rating: parseInt(rating),
        comment,
        reviewImageUrl
      }
    });
    res.json(newReview);
  } catch (error) {
    res.status(500).json({ error: "Error al publicar la reseña" });
  }
});

//Gestión de direcciones
app.get('/api/users/:userId/addresses', async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: parseInt(req.params.userId) }
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar direcciones" });
  }
});

app.post('/api/addresses', async (req, res) => {
  const { userId, street, colony, zipCode } = req.body;
  try {
    const newAddress = await prisma.address.create({
      data: { userId: parseInt(userId), street, colony, zipCode }
    });
    res.json(newAddress);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar dirección" });
  }
});

//gestión métodos de pago
app.get('/api/users/:userId/payments', async (req, res) => {
  try {
    const payments = await prisma.paymentMethod.findMany({
      where: { userId: parseInt(req.params.userId) }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar tarjetas" });
  }
});

app.post('/api/payments', async (req, res) => {
  const { userId, cardNumber, cardBrand } = req.body;
  try {
    //simulación de enmascarado de tarjeta
    const maskedNumber = `**** **** **** ${cardNumber.slice(-4)}`;
    
    const newPayment = await prisma.paymentMethod.create({
      data: { userId: parseInt(userId), cardNumber: maskedNumber, cardBrand }
    });
    res.json(newPayment);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar método de pago" });
  }
});

//  Crear una compra (Checkout Ficticio)
app.post('/api/checkout', async (req, res) => {
  const { buyerId, addressId, paymentMethodId, items, total, estimatedArrival } = req.body;

  try {
    // Crear la orden
    const newOrder = await prisma.order.create({
      data: {
        buyerId,
        addressId,
        paymentMethodId,
        total,
        estimatedArrival: new Date(estimatedArrival),
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    // 2. Descontar el stock (Loop a través de los items comprados)
    for (let item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    res.json({ message: "¡Compra realizada con éxito!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "No se pudo procesar la compra" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en el puerto ${PORT}`);
});