const express = require('express');
const VehiculoController = require('../controllers/vehiculoController');
const router = express.Router();


// Ruta para obtener todos los tipos de vehículos
router.get('/tipos', VehiculoController.getAllTiposVehiculo);

// Ruta para agregar un nuevo vehículo
router.post('/', VehiculoController.createVehiculo);

// Ruta para obtener un vehículo por su patente
router.get('/:patente', VehiculoController.getVehiculoByPatente);

// Ruta para actualizar un vehículo por su patente
router.put('/:patente', VehiculoController.updateVehiculo);

// Ruta para eliminar un vehículo por su patente
router.delete('/:patente', VehiculoController.deleteVehiculo);

// Ruta para obtener todos los vehículos
router.get('/', VehiculoController.getAllVehiculos);



module.exports = router;
