const express = require('express');
const router = express.Router();
const TipoContratoController = require('../controllers/tipocontratoController');

// Obtener todos los tipos de contrato
router.get('/', TipoContratoController.getAllTiposContrato);

// Obtener un tipo de contrato por ID
router.get('/:id', TipoContratoController.getTipoContratoById);

// Crear un nuevo tipo de contrato
router.post('/', TipoContratoController.addTipoContrato);

// Actualizar un tipo de contrato por ID
router.put('/:id', TipoContratoController.updateTipoContrato);

// Eliminar un tipo de contrato por ID
router.delete('/:id', TipoContratoController.deleteTipoContrato);

module.exports = router;
