const Presupuesto = require('../models/presupuestoModel');

/**
 * Controlador de presupuestos
 */
const PresupuestoController = {
  /**
   * Agrega un nuevo presupuesto.
   * Se omite el campo FECHA_CREACION_PRESUPUESTO_GENERAL para que se asigne automáticamente.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  addPresupuesto: async (req, res) => {
    const presupuesto = req.body;
  
    try {
      // Llamar al modelo para agregar el presupuesto
      const newPresupuesto = await Presupuesto.addPresupuesto(presupuesto);
  
      return res.status(201).json({
        message: 'Presupuesto agregado exitosamente',
        presupuesto: newPresupuesto,
      });
    } catch (error) {
      console.error('Error al agregar presupuesto:', error);
  
      // Si es un error de violación de restricción única (PostgreSQL 23505)
      if (error.code === '23505') {
        // Opcional: también se puede verificar que la restricción involucrada sea la que deseamos (por ejemplo, "unique_placa_idsucursal")
        if (error.constraint === 'unique_placa_idsucursal' ||
            (error.detail && error.detail.toLowerCase().includes('unique_placa_idsucursal'))) {
          return res.status(400).json({ message: 'Este presupuesto ya existe para esta sucursal' });
        }
      }
      
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  

  /**
   * Obtiene un presupuesto por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getPresupuestoById: async (req, res) => {
    const { id } = req.params;

    try {
      // Buscar presupuesto por ID
      const presupuesto = await Presupuesto.findPresupuestoById(id);

      if (!presupuesto) {
        return res.status(404).json({ message: 'Presupuesto no encontrado' });
      }

      res.status(200).json(presupuesto);
    } catch (error) {
      console.error('Error al buscar presupuesto por ID:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Actualiza un presupuesto por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  updatePresupuesto: async (req, res) => {
    const { id } = req.params;
    const presupuesto = req.body;

    try {
      // Actualizar presupuesto por ID
      const updatedPresupuesto = await Presupuesto.updatePresupuesto(id, presupuesto);

      if (!updatedPresupuesto) {
        return res.status(404).json({ message: 'Presupuesto no encontrado' });
      }

      res.status(200).json({
        message: 'Presupuesto actualizado exitosamente',
        presupuesto: updatedPresupuesto,
      });
    } catch (error) {
      console.error('Error al actualizar presupuesto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Elimina un presupuesto por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  deletePresupuesto: async (req, res) => {
    const { id } = req.params;

    try {
      // Eliminar presupuesto por ID
      const isDeleted = await Presupuesto.deletePresupuesto(id);

      if (!isDeleted) {
        return res.status(404).json({ message: 'Presupuesto no encontrado' });
      }

      res.status(200).json({ message: 'Presupuesto eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Obtiene todos los presupuestos registrados.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getAllPresupuestos: async (req, res) => {
    try {
      // Obtener todos los presupuestos
      const presupuestos = await Presupuesto.getAllPresupuestos();

      res.status(200).json(presupuestos);
    } catch (error) {
      console.error('Error al obtener todos los presupuestos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  
    /**
     * Obtiene presupuestos por la patente del vehículo.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    getPresupuestosByPlaca: async (req, res) => {
      try {
        const { placa } = req.params; // Obtener la placa desde los parámetros de la URL
  
        if (!placa) {
          return res.status(400).json({ message: "El parámetro 'placa' es obligatorio." });
        }
  
        const presupuestos = await Presupuesto.getPresupuestosByPlaca(placa);
  
        if (presupuestos.length === 0) {
          return res.status(404).json({ message: "No se encontraron presupuestos para esta patente." });
        }
  
        res.status(200).json(presupuestos);
      } catch (error) {
        console.error('Error al obtener presupuestos por placa de vehículo:', error);
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
};

module.exports = PresupuestoController;
