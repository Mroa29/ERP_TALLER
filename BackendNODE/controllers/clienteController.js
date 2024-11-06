// Importar el modelo de cliente
const clienteModel = require('../models/clienteModel');

// Obtener todos los clientes
const getAllClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.getAllClientes();
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
};

// Crear un nuevo cliente
const createCliente = async (req, res) => {
    const clienteData = req.body;
    try {
        const nuevoCliente = await clienteModel.createCliente(clienteData);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error al crear cliente' });
    }
};

// Obtener un cliente por ID
const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await clienteModel.getClienteById(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({ error: 'Error al obtener el cliente' });
    }
};

// Actualizar un cliente por ID
const updateCliente = async (req, res) => {
    const { id } = req.params;
    const clienteData = req.body;
    try {
        const clienteActualizado = await clienteModel.updateCliente(id, clienteData);
        if (!clienteActualizado) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(clienteActualizado);
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
};

// Eliminar un cliente por ID
const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const clienteEliminado = await clienteModel.deleteCliente(id);
        if (!clienteEliminado) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
};

module.exports = {
    getAllClientes,
    createCliente,
    getClienteById,
    updateCliente,
    deleteCliente
};
