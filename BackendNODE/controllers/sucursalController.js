// Importar el modelo de sucursales
const Sucursal = require('../models/sucursalModel');

/**
 * Controlador de sucursales
 */
const SucursalController = {
  /**
   * Agregar una nueva sucursal
   * @param {Object} req - Objeto de solicitud HTTP
   * @param {Object} res - Objeto de respuesta HTTP
   */
  addSucursal: async (req, res) => {
    const sucursalData = req.body;

    try {
      const newSucursal = await Sucursal.addSucursal(sucursalData);
      res.status(201).json({ message: 'Sucursal creada exitosamente', sucursal: newSucursal });
    } catch (error) {
      console.error('Error al agregar sucursal:', error);
      res.status(500).json({ message: 'Error al agregar sucursal' });
    }
  },

  /**
   * Obtener todas las sucursales
   * @param {Object} req - Objeto de solicitud HTTP
   * @param {Object} res - Objeto de respuesta HTTP
   */
  getAllSucursales: async (req, res) => {
    try {
      const sucursales = await Sucursal.getAllSucursales();
      res.status(200).json(sucursales);
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      res.status(500).json({ message: 'Error al obtener sucursales' });
    }
  },

  /**
   * Obtener una sucursal por su ID
   * @param {Object} req - Objeto de solicitud HTTP
   * @param {Object} res - Objeto de respuesta HTTP
   */
  getSucursalById: async (req, res) => {
    const { id } = req.params;

    try {
      const sucursal = await Sucursal.getSucursalById(id);
      if (!sucursal) {
        return res.status(404).json({ message: 'Sucursal no encontrada' });
      }
      res.status(200).json(sucursal);
    } catch (error) {
      console.error('Error al obtener sucursal por ID:', error);
      res.status(500).json({ message: 'Error al obtener sucursal' });
    }
  },

  /**
   * Obtener una sucursal por nombre
   * @param {Object} req - Objeto de solicitud HTTP
   * @param {Object} res - Objeto de respuesta HTTP
   */
  getSucursalByNombre: async (req, res) => {
    const { nombre } = req.params;

    try {
      const sucursal = await Sucursal.getSucursalByNombre(nombre);
      if (!sucursal) {
        return res.status(404).json({ message: 'Sucursal no encontrada' });
      }
      res.status(200).json(sucursal);
    } catch (error) {
      console.error('Error al obtener sucursal por nombre:', error);
      res.status(500).json({ message: 'Error al obtener sucursal' });
    }
  },

  /**
   * Actualizar una sucursal por su ID
   * @param {Object} req - Objeto de solicitud HTTP
   * @param {Object} res - Objeto de respuesta HTTP
   */
  updateSucursal: async (req, res) => {
    const { id } = req.params;
    const sucursalData = req.body;

    try {
      const updatedSucursal = await Sucursal.updateSucursal(id, sucursalData);
      if (!updatedSucursal) {
        return res.status(404).json({ message: 'Sucursal no encontrada' });
      }
      res.status(200).json({ message: 'Sucursal actualizada exitosamente', sucursal: updatedSucursal });
    } catch (error) {
      console.error('Error al actualizar sucursal:', error);
      res.status(500).json({ message: 'Error al actualizar sucursal' });
    }
  },

  /**
   * Eliminar una sucursal por su ID
   * @param {Object} req - Objeto de solicitud HTTP
   * @param {Object} res - Objeto de respuesta HTTP
   */
  deleteSucursal: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedSucursal = await Sucursal.deleteSucursal(id);
      if (!deletedSucursal) {
        return res.status(404).json({ message: 'Sucursal no encontrada' });
      }
      res.status(200).json({ message: 'Sucursal eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar sucursal:', error);
      res.status(500).json({ message: 'Error al eliminar sucursal' });
    }
  },
};

module.exports = SucursalController;
