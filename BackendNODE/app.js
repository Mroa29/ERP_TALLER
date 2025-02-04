const express = require('express');
const cors = require('cors');
const path = require("path");
const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const clientesRoutes = require('./routes/clientesRoutes');
const talleresRoutes = require('./routes/tallerRoutes');
const sucursalesRoutes = require('./routes/sucursalRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const empleadoRoutes = require('./routes/empleadosRoutes');
const cargoRoutes = require('./routes/cargoRoutes');
const contratoRoutes = require('./routes/contratoRoutes');
const tipoContratoRoutes = require('./routes/tipocontratoRoutes');
const documentosRoutes = require("./routes/documentosRoutes");
const insumoRoutes = require("./routes/InsumoRoutes");
const itemEspecificoRoutes = require("./routes/itemEspecificoRoutes");
const presupuestoRoutes = require('./routes/presupuestoRoutes'); 
const tarifaRoutes = require('./routes/tarifaPinturaRoutes');
const tarifaManoObraRoutes = require('./routes/tarifaManObraRoutes');
const pinturaPresupuestadaRoutes = require("./routes/PinturaPresupuetsdaRouter");
const manoDeObraPresupuestadaRoutes = require('./routes/manoObraPresupuestadaRoutes');
const repuestoPresupuestadoRoutes = require("./routes/RepuestoPresupuestadoRoutes");
const cobroRoutes = require("./routes/CobrosRoutes");









app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/clientes', clientesRoutes);  
app.use('/api/talleres', talleresRoutes);  
app.use('/api/usuarios', usuarioRoutes);  
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/tiposcontrato', tipoContratoRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/insumos", insumoRoutes);
app.use("/api/item-especifico", itemEspecificoRoutes);
app.use('/api/presupuestos', presupuestoRoutes); 
app.use('/api/tarifasPintura', tarifaRoutes);
app.use('/api/tarifas-mano-obra', tarifaManoObraRoutes);
app.use("/api/pintura-presupuestada", pinturaPresupuestadaRoutes);
app.use('/api/mano-de-obra-presupuestada', manoDeObraPresupuestadaRoutes);
app.use("/api/repuestos-presupuestados", repuestoPresupuestadoRoutes);
app.use("/api/cobros", cobroRoutes);


module.exports = app;
