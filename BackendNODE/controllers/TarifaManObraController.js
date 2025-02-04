const TarifaManoObra = require('../models/TarifaManObraModel');

const TarifaManoObraController = {
  /**
   * Agrega una nueva tarifa de mano de obra.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  addTarifa: async (req, res) => {
    const tarifa = req.body;

    try {
      // Validación de campos obligatorios
      if (!tarifa.descripcion_tarifa || !tarifa.precio_por_pieza || !tarifa.id_sucursal) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Insertar la nueva tarifa en la base de datos
      const newTarifa = await TarifaManoObra.addTarifa(tarifa);

      res.status(201).json({
        message: "Tarifa de mano de obra agregada exitosamente.",
        tarifa: newTarifa,
      });
    } catch (error) {
      console.error("Error al agregar tarifa de mano de obra:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  /**
   * Obtiene todas las tarifas de mano de obra registradas.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getAllTarifas: async (req, res) => {
    try {
      const tarifas = await TarifaManoObra.getAllTarifas();
      res.status(200).json(tarifas);
    } catch (error) {
      console.error("Error al obtener todas las tarifas de mano de obra:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  /**
   * Obtiene una tarifa de mano de obra por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getTarifaById: async (req, res) => {
    const { id } = req.params;

    try {
      const tarifa = await TarifaManoObra.findTarifaById(id);

      if (!tarifa) {
        return res.status(404).json({ message: "Tarifa de mano de obra no encontrada." });
      }

      res.status(200).json(tarifa);
    } catch (error) {
      console.error("Error al obtener tarifa de mano de obra por ID:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  /**
   * Actualiza una tarifa de mano de obra por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  updateTarifa: async (req, res) => {
    const { id } = req.params;
    const tarifa = req.body;

    try {
      // Validación de campos obligatorios
      if (!tarifa.descripcion_tarifa || !tarifa.precio_por_pieza || !tarifa.id_sucursal) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
      }

      // Actualizar la tarifa en la base de datos
      const updatedTarifa = await TarifaManoObra.updateTarifa(id, tarifa);

      if (!updatedTarifa) {
        return res.status(404).json({ message: "Tarifa de mano de obra no encontrada." });
      }

      res.status(200).json({
        message: "Tarifa de mano de obra actualizada exitosamente.",
        tarifa: updatedTarifa,
      });
    } catch (error) {
      console.error("Error al actualizar tarifa de mano de obra:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  /**
   * Elimina una tarifa de mano de obra por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  deleteTarifa: async (req, res) => {
    const { id } = req.params;

    try {
      const isDeleted = await TarifaManoObra.deleteTarifa(id);

      if (!isDeleted) {
        return res.status(404).json({ message: "Tarifa de mano de obra no encontrada." });
      }

      res.status(200).json({ message: "Tarifa de mano de obra eliminada exitosamente." });
    } catch (error) {
      console.error("Error al eliminar tarifa de mano de obra:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },
};

module.exports = TarifaManoObraController;
