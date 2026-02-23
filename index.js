const express = require('express');
const connectDB = require('./config/config');
const postRoutes = require('./routes/posts');

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/', postRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

// Solo ejecuta esto si el archivo se corre directamente (no desde tests)
if (require.main === module) {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;  // ← esta línea es obligatoria para supertest