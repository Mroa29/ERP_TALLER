// Importar el modelo de Proveedor
const Proveedor = require('../models/proveedorModel');

const proveedorController = {
  /**
   * Obtener todos los proveedores.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getAllProveedores: async (req, res) => {
    try {
      const proveedores = await Proveedor.getAllProveedores();
      res.status(200).json(proveedores);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      res.status(500).json({ message: 'Error al obtener proveedores.' });
    }
  },

  /**
   * Obtener un proveedor por RUT y ID de taller.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getProveedorById: async (req, res) => {
    const { rut, idTaller } = req.params;
    try {
      const proveedor = await Proveedor.getProveedorById(rut, idTaller);
      if (!proveedor) {
        return res.status(404).json({ message: 'Proveedor no encontrado.' });
      }
      res.status(200).json(proveedor);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      res.status(500).json({ message: 'Error al obtener proveedor.' });
    }
  },

  /**
   * Agregar un nuevo proveedor.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  addProveedor: async (req, res) => {
    const proveedorData = req.body;
    try {
      const nuevoProveedor = await Proveedor.addProveedor(proveedorData);
      res.status(201).json(nuevoProveedor);
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
      res.status(500).json({ message: 'Error al agregar proveedor.' });
    }
  },

  /**
   * Actualizar un proveedor por RUT y ID de taller.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  updateProveedor: async (req, res) => {
    const { rut, idTaller } = req.params;
    const proveedorData = req.body;
    try {
      const proveedorActualizado = await Proveedor.updateProveedor(rut, idTaller, proveedorData);
      if (!proveedorActualizado) {
        return res.status(404).json({ message: 'Proveedor no encontrado para actualizar.' });
      }
      res.status(200).json(proveedorActualizado);
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      res.status(500).json({ message: 'Error al actualizar proveedor.' });
    }
  },

  /**
   * Eliminar un proveedor por RUT y ID de taller.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  deleteProveedor: async (req, res) => {
    const { rut, idTaller } = req.params;
    try {
      const proveedorEliminado = await Proveedor.deleteProveedor(rut, idTaller);
      if (!proveedorEliminado) {
        return res.status(404).json({ message: 'Proveedor no encontrado para eliminar.' });
      }
      res.status(200).json({ message: 'Proveedor eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      res.status(500).json({ message: 'Error al eliminar proveedor.' });
    }
  },

  /**
   * Obtener todos los tipos de proveedores.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getAllTiposProveedores: async (req, res) => {
    try {
      const tiposProveedores = await Proveedor.getAllTiposProveedores();
      res.status(200).json(tiposProveedores);
    } catch (error) {
      console.error('Error al obtener los tipos de proveedores:', error);
      res.status(500).json({ message: 'Error al obtener los tipos de proveedores.' });
    }
  },
};

module.exports = proveedorController;
