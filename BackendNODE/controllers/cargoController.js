const Cargo = require('../models/cargoModel');

const cargoController = {
    /**
     * Obtener todos los cargos.
     */
    getAllCargos: async (req, res) => {
        try {
            const cargos = await Cargo.getAllCargos();
            res.json(cargos);
        } catch (error) {
            console.error('Error al obtener los cargos:', error);
            res.status(500).json({ message: 'Error al obtener los cargos' });
        }
    },

    /**
     * Obtener un cargo por ID.
     */
    getCargoById: async (req, res) => {
        try {
            const { id } = req.params;
            const cargo = await Cargo.getCargoById(id);
            if (!cargo) {
                return res.status(404).json({ message: 'Cargo no encontrado' });
            }
            res.json(cargo);
        } catch (error) {
            console.error('Error al obtener el cargo:', error);
            res.status(500).json({ message: 'Error al obtener el cargo' });
        }
    },

    /**
     * Crear un nuevo cargo.
     */
    addCargo: async (req, res) => {
        try {
            const nuevoCargo = await Cargo.addCargo(req.body);
            res.status(201).json(nuevoCargo);
        } catch (error) {
            console.error('Error al agregar el cargo:', error);
            res.status(500).json({ message: 'Error al agregar el cargo' });
        }
    },

    /**
     * Actualizar un cargo por ID.
     */
    updateCargo: async (req, res) => {
        try {
            const { id } = req.params;
            const cargoActualizado = await Cargo.updateCargo(id, req.body);
            if (!cargoActualizado) {
                return res.status(404).json({ message: 'Cargo no encontrado' });
            }
            res.json(cargoActualizado);
        } catch (error) {
            console.error('Error al actualizar el cargo:', error);
            res.status(500).json({ message: 'Error al actualizar el cargo' });
        }
    },

    /**
     * Eliminar un cargo por ID.
     */
    deleteCargo: async (req, res) => {
        try {
            const { id } = req.params;
            const eliminado = await Cargo.deleteCargo(id);
            if (!eliminado) {
                return res.status(404).json({ message: 'Cargo no encontrado' });
            }
            res.json({ message: 'Cargo eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar el cargo:', error);
            res.status(500).json({ message: 'Error al eliminar el cargo' });
        }
    }
};

module.exports = cargoController;
