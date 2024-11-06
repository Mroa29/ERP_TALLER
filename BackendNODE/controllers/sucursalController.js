// Importar el modelo de sucursales
const sucursalModel = require('../models/sucursalModel');

// Crear una nueva sucursal
const createSucursal = async (req, res) => {
    const sucursalData = req.body;
    try {
        const nuevaSucursal = await sucursalModel.createSucursal(sucursalData);
        res.status(201).json(nuevaSucursal);
    } catch (error) {
        console.error('Error al crear la sucursal:', error);
        res.status(500).json({ error: 'Error al crear la sucursal' });
    }
};

// Obtener todas las sucursales
const getAllSucursales = async (req, res) => {
    try {
        const sucursales = await sucursalModel.getAllSucursales();
        res.status(200).json(sucursales);
    } catch (error) {
        console.error('Error al obtener las sucursales:', error);
        res.status(500).json({ error: 'Error al obtener las sucursales' });
    }
};

// Obtener una sucursal por ID
const getSucursalById = async (req, res) => {
    const { id } = req.params;
    try {
        const sucursal = await sucursalModel.getSucursalById(id);
        if (!sucursal) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.status(200).json(sucursal);
    } catch (error) {
        console.error('Error al obtener la sucursal:', error);
        res.status(500).json({ error: 'Error al obtener la sucursal' });
    }
};

// Actualizar una sucursal por ID
const updateSucursal = async (req, res) => {
    const { id } = req.params;
    const sucursalData = req.body;
    try {
        const sucursalActualizada = await sucursalModel.updateSucursal(id, sucursalData);
        if (!sucursalActualizada) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.status(200).json(sucursalActualizada);
    } catch (error) {
        console.error('Error al actualizar la sucursal:', error);
        res.status(500).json({ error: 'Error al actualizar la sucursal' });
    }
};

// Eliminar una sucursal por ID
const deleteSucursal = async (req, res) => {
    const { id } = req.params;
    try {
        const sucursalEliminada = await sucursalModel.deleteSucursal(id);
        if (!sucursalEliminada) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.status(200).json({ message: 'Sucursal eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la sucursal:', error);
        res.status(500).json({ error: 'Error al eliminar la sucursal' });
    }
};

module.exports = {
    createSucursal,
    getAllSucursales,
    getSucursalById,
    updateSucursal,
    deleteSucursal
};
