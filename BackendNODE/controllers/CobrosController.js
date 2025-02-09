const Cobro = require("../models/CobrosModel");

const CobroController = {
  /**
   * Agrega un nuevo cobro.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  addCobro: async (req, res) => {
    try {
      const nuevoCobro = await Cobro.addCobro(req.body);
      res.status(201).json({
        message: "Cobro agregado exitosamente.",
        cobro: nuevoCobro,
      });
    } catch (error) {
      console.error("Error al agregar cobro:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  /**
   * Obtiene todos los cobros asociados a un presupuesto específico.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getCobrosByPresupuesto: async (req, res) => {
    const { idPresupuesto } = req.params;
    try {
      const cobros = await Cobro.getCobrosByPresupuesto(idPresupuesto);
      res.status(200).json(cobros);
    } catch (error) {
      console.error("Error al obtener cobros:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  /**
   * Edita un cobro por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  updateCobro: async (req, res) => {
    const { idCobro } = req.params;
    try {
      const cobroActualizado = await Cobro.updateCobro(idCobro, req.body);
      if (!cobroActualizado) {
        return res.status(404).json({ message: "Cobro no encontrado." });
      }
      res.status(200).json({
        message: "Cobro actualizado exitosamente.",
        cobro: cobroActualizado,
      });
    } catch (error) {
      console.error("Error al actualizar cobro:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  /**
   * Elimina un cobro por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  deleteCobro: async (req, res) => {
    const { idCobro } = req.params;
    try {
      const idEliminado = await Cobro.deleteCobro(idCobro);
      if (!idEliminado) {
        return res.status(404).json({ message: "Cobro no encontrado." });
      }
      res.status(200).json({
        message: "Cobro eliminado exitosamente.",
        idCobro: idEliminado,
      });
    } catch (error) {
      console.error("Error al eliminar cobro:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },

  async getCobroById(req, res) {
    try {
        const { id } = req.params;
        const cobro = await Cobro.getCobroById(id);

        if (!cobro) {
            return res.status(404).json({ message: "Cobro no encontrado." });
        }

        res.json(cobro);
    } catch (error) {
        console.error("Error al obtener el cobro por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
    },

    /**
     * Obtiene la suma total de los cobros para un presupuesto específico.
     * @param {Object} req - Objeto de la solicitud HTTP.
     * @param {Object} res - Objeto de la respuesta HTTP.
     */
    async getTotalCobradoByPresupuesto(req, res) {
      try {
          const { idPresupuesto } = req.params;
          const totalCobrado = await Cobro.getTotalCobradoByPresupuesto(idPresupuesto);

          res.json({ total_cobrado: totalCobrado });
      } catch (error) {
          console.error("Error al obtener el total cobrado:", error);
          res.status(500).json({ message: "Error interno del servidor" });
      }
  },

  /**
   * Controlador para obtener la suma total de la cantidad cobrada de un taller.
   * @param {Object} req - Objeto de solicitud (Request).
   * @param {Object} res - Objeto de respuesta (Response).
   */
  getTotalCobrado: async (req, res) => {
    try {
      const { idTaller } = req.params;

      // Validación básica del parámetro
      if (!idTaller || isNaN(idTaller)) {
        return res.status(400).json({ message: 'El ID del taller es requerido y debe ser un número.' });
      }

      // Llamar al modelo para obtener la suma total cobrada
      const totalCobrado = await Cobro.getTotalCobradoPorTaller(idTaller);

      // Respuesta exitosa
      return res.status(200).json({ 
        idTaller: parseInt(idTaller, 10), 
        totalCobrado 
      });
    } catch (error) {
      console.error('Error en el controlador getTotalCobrado:', error);
      return res.status(500).json({ message: 'Error al obtener el total cobrado.' });
    }
  }
    
};

module.exports = CobroController;
