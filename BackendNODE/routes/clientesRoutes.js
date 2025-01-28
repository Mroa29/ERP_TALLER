const express = require('express');
const ClienteController = require('../controllers/clienteController');
const router = express.Router();

// Ruta para obtener todos los tipos de clientes
router.get('/tipos', ClienteController.getAllTiposClientes);

//Ruta para obtener un tipo de cliente por id
router.get('/tipos/:id',ClienteController.getTipoClienteById)

// Ruta para obtener todos los estados de clientes
router.get('/estados', ClienteController.getAllEstadosClientes);

// Ruta para buscar tipo_cliente por descripción
router.get('/tipos/:descripcion', ClienteController.getTipoClienteByDescripcion);

// Ruta para buscar estado_cliente por descripción
router.get('/estados/:descripcion', ClienteController.getEstadoClienteByDescripcion);

// Ruta para agregar un nuevo cliente
router.post('/', ClienteController.addCliente);

// Ruta para obtener un cliente por RUT
router.get('/:rut', ClienteController.getClienteByRut);

// Ruta para actualizar un cliente por RUT
router.put('/:rut', ClienteController.updateCliente);

// Ruta para eliminar un cliente por RUT
router.delete('/:rut', ClienteController.deleteCliente);

// Ruta para obtener todos los clientes
router.get('/', ClienteController.getAllClientes);



module.exports = router;
