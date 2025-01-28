const Cliente = require('../models/clienteModel');

/**
 * Controlador de clientes
 */
const ClienteController = {
  /**
   * Agrega un nuevo cliente.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  addCliente: async (req, res) => {
    const cliente = req.body;

    try {
      // Llamar al modelo para agregar el cliente
      const newCliente = await Cliente.addCliente(cliente);

      res.status(201).json({
        message: 'Cliente agregado exitosamente',
        cliente: newCliente,
      });
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Obtiene un cliente por su RUT.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  getClienteByRut: async (req, res) => {
    const { rut } = req.params;

    try {
      // Buscar cliente por RUT
      const cliente = await Cliente.findClienteByRut(rut);

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      res.status(200).json(cliente);
    } catch (error) {
      console.error('Error al buscar cliente por RUT:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Actualiza un cliente por su RUT.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  updateCliente: async (req, res) => {
    const { rut } = req.params;
    const cliente = req.body;

    try {
      // Actualizar cliente por RUT
      const updatedCliente = await Cliente.updateCliente(rut, cliente);

      if (!updatedCliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      res.status(200).json({
        message: 'Cliente actualizado exitosamente',
        cliente: updatedCliente,
      });
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Elimina un cliente por su RUT.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  deleteCliente: async (req, res) => {
    const { rut } = req.params;

    try {
      // Eliminar cliente por RUT
      const isDeleted = await Cliente.deleteCliente(rut);

      if (!isDeleted) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Obtiene todos los clientes.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  getAllClientes: async (req, res) => {
    try {
      // Obtener todos los clientes
      const clientes = await Cliente.getAllClientes();

      res.status(200).json(clientes);
    } catch (error) {
      console.error('Error al obtener todos los clientes:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
 * Obtiene todos los tipos de clientes.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
getAllTiposClientes: async (req, res) => {
    try {
      const tiposClientes = await Cliente.getAllTiposClientes();
  
      res.status(200).json(tiposClientes);
    } catch (error) {
      console.error('Error al obtener los tipos de clientes:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  
  /**
   * Obtiene todos los estados de clientes.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  getAllEstadosClientes: async (req, res) => {
    try {
      const estadosClientes = await Cliente.getAllEstadosClientes();
  
      res.status(200).json(estadosClientes);
    } catch (error) {
      console.error('Error al obtener los estados de clientes:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  // Buscar tipo_cliente por descripción
  getTipoClienteByDescripcion: async (req, res) => {
    const { descripcion } = req.params;

    try {
        const tipoCliente = await Cliente.getTipoClienteByDescripcion(descripcion);

        if (!tipoCliente) {
            return res.status(404).json({ message: 'Tipo de cliente no encontrado' });
        }

        res.status(200).json(tipoCliente);
    } catch (error) {
        console.error('Error al buscar tipo_cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
},

// Buscar estado_cliente por descripción
getEstadoClienteByDescripcion: async (req, res) => {
    const { descripcion } = req.params;

    try {
        const estadoCliente = await Cliente.getEstadoClienteByDescripcion(descripcion);

        if (!estadoCliente) {
            return res.status(404).json({ message: 'Estado de cliente no encontrado' });
        }

        res.status(200).json(estadoCliente);
    } catch (error) {
        console.error('Error al buscar estado_cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
},

/**
   * Obtiene un tipo de cliente por su ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
getTipoClienteById: async (req, res) => {
  const { id } = req.params;

  try {
    // Validar que el ID sea un número válido
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
    }

    // Llamar al modelo para obtener el tipo de cliente
    const tipoCliente = await Cliente.getTipoClienteById(id);

    if (!tipoCliente) {
      return res.status(404).json({ message: 'Tipo de cliente no encontrado.' });
    }

    // Enviar el tipo de cliente encontrado
    res.status(200).json(tipoCliente);
  } catch (error) {
    console.error('Error al obtener el tipo de cliente por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
},
  
};

module.exports = ClienteController;
