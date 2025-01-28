const Vehiculo = require('../models/vehiculoModel');

const VehiculoController = {
  /**
   * Agregar un nuevo vehículo.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  createVehiculo: async (req, res) => {
    const vehiculo = req.body;

    try {
      await Vehiculo.createVehiculo(vehiculo);
      res.status(201).json({ message: 'Vehículo agregado exitosamente.' });
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  /**
   * Obtener un vehículo por su patente.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getVehiculoByPatente: async (req, res) => {
    const { patente } = req.params;

    try {
      const vehiculo = await Vehiculo.getVehiculoByPatente(patente);

      if (!vehiculo) {
        return res.status(404).json({ message: 'Vehículo no encontrado.' });
      }

      res.status(200).json(vehiculo);
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  /**
   * Actualizar un vehículo por su patente.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  updateVehiculo: async (req, res) => {
    const { patente } = req.params;
    const vehiculo = req.body;

    try {
      await Vehiculo.updateVehiculo(patente, vehiculo);
      res.status(200).json({ message: 'Vehículo actualizado exitosamente.' });
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  /**
   * Eliminar un vehículo por su patente.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  deleteVehiculo: async (req, res) => {
    const { patente } = req.params;

    try {
      await Vehiculo.deleteVehiculo(patente);
      res.status(200).json({ message: 'Vehículo eliminado exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  /**
   * Obtener todos los vehículos.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getAllVehiculos: async (req, res) => {
    try {
      const vehiculos = await Vehiculo.getAllVehiculos();
      res.status(200).json(vehiculos);
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },

  /**
   * Obtener todos los tipos de vehículos.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  getAllTiposVehiculo: async (req, res) => {
    try {
      const tiposVehiculos = await Vehiculo.getAllTiposVehiculo();
      res.status(200).json(tiposVehiculos);
    } catch (error) {
      console.error('Error al obtener tipos de vehículos:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  },
};

module.exports = VehiculoController;
