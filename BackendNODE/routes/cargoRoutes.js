const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');

/**
 * @route GET /api/cargos
 * @desc Obtener todos los cargos
 */
router.get('/', cargoController.getAllCargos);

/**
 * @route GET /api/cargos/:id
 * @desc Obtener un cargo por ID
 */
router.get('/:id', cargoController.getCargoById);

/**
 * @route POST /api/cargos
 * @desc Crear un nuevo cargo
 */
router.post('/', cargoController.addCargo);

/**
 * @route PUT /api/cargos/:id
 * @desc Actualizar un cargo por ID
 */
router.put('/:id', cargoController.updateCargo);

/**
 * @route DELETE /api/cargos/:id
 * @desc Eliminar un cargo por ID
 */
router.delete('/:id', cargoController.deleteCargo);

module.exports = router;
