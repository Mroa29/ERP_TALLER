
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rutas CRUD para clientes

// Crear un nuevo cliente
router.post('/', clienteController.createCliente);

// Obtener todos los clientes
router.get('/', clienteController.getAllClientes);

// Obtener un cliente por ID
router.get('/:id', clienteController.getClienteById);

// Actualizar un cliente por ID
router.put('/:id', clienteController.updateCliente);

// Eliminar un cliente por ID
router.delete('/:id', clienteController.deleteCliente);


module.exports = router;
