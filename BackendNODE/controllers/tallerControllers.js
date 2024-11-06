const tallerModel = require('../models/tallerModel');

// Obtener todos los talleres
const getAllTalleres = async (req, res) => {
    try {
        const talleres = await tallerModel.getAllTalleres();
        res.status(200).json(talleres);
    } catch (error) {
        console.error('Error al obtener los talleres:', error);
        res.status(500).json({ error: 'Error al obtener los talleres' });
    }
};

// Crear un nuevo taller
const createTaller = async (req, res) => {
    const tallerData = req.body;
    try {
        const nuevoTaller = await tallerModel.createTaller(tallerData);
        res.status(201).json(nuevoTaller);
    } catch (error) {
        console.error('Error al crear el taller:', error);
        res.status(500).json({ error: 'Error al crear el taller' });
    }
};

// Obtener un taller por ID
const getTallerById = async (req, res) => {
    const { id } = req.params;
    try {
        const taller = await tallerModel.getTallerById(id);
        if (!taller) {
            return res.status(404).json({ error: 'Taller no encontrado' });
        }
        res.status(200).json(taller);
    } catch (error) {
        console.error('Error al obtener el taller:', error);
        res.status(500).json({ error: 'Error al obtener el taller' });
    }
};

// Actualizar un taller por ID
const updateTaller = async (req, res) => {
    const { id } = req.params;
    const tallerData = req.body;
    try {
        const tallerActualizado = await tallerModel.updateTaller(id, tallerData);
        if (!tallerActualizado) {
            return res.status(404).json({ error: 'Taller no encontrado' });
        }
        res.status(200).json(tallerActualizado);
    } catch (error) {
        console.error('Error al actualizar el taller:', error);
        res.status(500).json({ error: 'Error al actualizar el taller' });
    }
};

// Eliminar un taller por ID
const deleteTaller = async (req, res) => {
    const { id } = req.params;
    try {
        const tallerEliminado = await tallerModel.deleteTaller(id);
        if (!tallerEliminado) {
            return res.status(404).json({ error: 'Taller no encontrado' });
        }
        res.status(200).json({ message: 'Taller eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el taller:', error);
        res.status(500).json({ error: 'Error al eliminar el taller' });
    }
};

module.exports = {
    getAllTalleres,
    createTaller,
    getTallerById,
    updateTaller,
    deleteTaller
};
