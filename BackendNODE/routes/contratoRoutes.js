const express = require('express');
const router = express.Router();
const ContratoController = require('../controllers/contratoController');

// Obtener todos los contratos
router.get('/', ContratoController.getAllContratos);

// Obtener un contrato por ID
router.get('/:id', ContratoController.getContratoById);

// Crear un nuevo contrato
router.post('/', ContratoController.addContrato);

// Actualizar un contrato por ID
router.put('/:id', ContratoController.updateContrato);

// Eliminar un contrato por ID
router.delete('/:id', ContratoController.deleteContrato);

module.exports = router;
