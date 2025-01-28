const express = require('express');
const cors = require('cors');
const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors());
app.use(express.json());

const clientesRoutes = require('./routes/clientesRoutes');
const talleresRoutes = require('./routes/tallerRoutes');
const sucursalesRoutes = require('./routes/sucursalRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');

app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/clientes', clientesRoutes);  // Rutas para la entidad clientes
app.use('/api/talleres', talleresRoutes);  // Rutas para la entidad talleres
app.use('/api/usuarios', usuarioRoutes);  // Rutas para la entidad usuarios
app.use('/api/vehiculos', vehiculoRoutes);

module.exports = app;