// Importar el modelo de Taller
const Taller = require('../models/tallerModel');

/**
 * Controlador para la gestión de talleres
 */
const TallerController = {
  /**
   * Obtiene todos los talleres.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getAllTalleres: async (req, res) => {
    try {
      const talleres = await Taller.findAll();
      res.status(200).json(talleres);
    } catch (error) {
      console.error('Error al obtener los talleres:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Obtiene un taller por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getTallerById: async (req, res) => {
    const { id } = req.params;

    try {
      const taller = await Taller.findById(id);
      if (!taller) {
        return res.status(404).json({ message: 'Taller no encontrado' });
      }

      res.status(200).json(taller);
    } catch (error) {
      console.error('Error al obtener el taller por ID:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Crea un nuevo taller.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  createTaller: async (req, res) => {
    const data = req.body;

    try {
      const nuevoTaller = await Taller.create(data);
      res.status(201).json(nuevoTaller);
    } catch (error) {
      console.error('Error al crear el taller:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Actualiza un taller por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  updateTaller: async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      const tallerActualizado = await Taller.update(id, data);
      if (!tallerActualizado) {
        return res.status(404).json({ message: 'Taller no encontrado' });
      }

      res.status(200).json(tallerActualizado);
    } catch (error) {
      console.error('Error al actualizar el taller:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Elimina un taller por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  deleteTaller: async (req, res) => {
    const { id } = req.params;

    try {
      const eliminado = await Taller.delete(id);
      if (!eliminado) {
        return res.status(404).json({ message: 'Taller no encontrado' });
      }

      res.status(200).json({ message: 'Taller eliminado con éxito' });
    } catch (error) {
      console.error('Error al eliminar el taller:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
};

module.exports = TallerController;
