const PinturaPresupuestada = require('../models/PinturaPresupuestadaModel');

/**
 * Controlador de PINTURA_PRESUPUESTADA
 */
const PinturaPresupuestadaController = {
  /**
   * Agrega una nueva pintura presupuestada.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  addPinturaPresupuestada: async (req, res) => {
    const pintura = req.body;

    try {
      // Validación de datos obligatorios
      if (!pintura.id_presupuesto || !pintura.nombre_pieza_pintada || !pintura.cantidad_piezas_pintadas || !pintura.id_tarifa_piezas_pintadas) {
        return res.status(400).json({ message: "Todos los campos obligatorios deben ser completados." });
      }

      // Insertar en la base de datos
      const newPintura = await PinturaPresupuestada.addPinturaPresupuestada(pintura);
      res.status(201).json({
        message: "Pintura presupuestada agregada exitosamente.",
        pintura: newPintura
      });
    } catch (error) {
      console.error("Error al agregar pintura presupuestada:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  /**
   * Obtiene todas las pinturas presupuestadas.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getAllPinturasPresupuestadas: async (req, res) => {
    try {
      const pinturas = await PinturaPresupuestada.getAllPinturasPresupuestadas();
      res.status(200).json(pinturas);
    } catch (error) {
      console.error("Error al obtener todas las pinturas presupuestadas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  /**
   * Obtiene una pintura presupuestada por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getPinturaPresupuestadaById: async (req, res) => {
    const { id } = req.params;

    try {
      const pintura = await PinturaPresupuestada.getPinturaPresupuestadaById(id);
      if (!pintura) {
        return res.status(404).json({ message: "Pintura presupuestada no encontrada." });
      }

      res.status(200).json(pintura);
    } catch (error) {
      console.error("Error al obtener pintura presupuestada por ID:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  /**
   * Obtiene todas las pinturas presupuestadas de un presupuesto específico.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getPinturasByPresupuesto: async (req, res) => {
    const { id_presupuesto } = req.params;

    try {
      const pinturas = await PinturaPresupuestada.getPinturasByPresupuesto(id_presupuesto);
      res.status(200).json(pinturas);
    } catch (error) {
      console.error("Error al obtener pinturas presupuestadas por presupuesto:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

 /**
 * Elimina una pintura presupuestada por su ID y devuelve el ID eliminado.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
deletePinturaPresupuestada: async (req, res) => {
    const { id } = req.params;

    try {
        // Llamar al modelo para eliminar la pintura presupuestada
        const deletedId = await PinturaPresupuestada.deletePinturaPresupuestada(id);

        if (!deletedId) {
            return res.status(404).json({ message: "Pintura presupuestada no encontrada." });
        }

        // Respuesta exitosa con el ID eliminado
        res.status(200).json({ 
            message: "Pintura presupuestada eliminada exitosamente.", 
            id_pintura_presupuestada: deletedId 
        });
    } catch (error) {
        console.error("Error al eliminar pintura presupuestada:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  /**
     * Obtiene la suma total de las pinturas presupuestadas para un presupuesto.
     * @param {Object} req - Objeto de la solicitud HTTP.
     * @param {Object} res - Objeto de la respuesta HTTP.
     */
  async getTotalPinturaPresupuestada(req, res) {
    try {
        const { idPresupuesto } = req.params;
        const totalPintura = await PinturaPresupuestada.getTotalPinturaPresupuestada(idPresupuesto);

        res.json({ total_pintura_presupuestada: totalPintura });
    } catch (error) {
        console.error("Error al obtener el total de pintura presupuestada:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
 }

};

module.exports = PinturaPresupuestadaController;
