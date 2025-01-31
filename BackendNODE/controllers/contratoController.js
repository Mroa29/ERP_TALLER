const Contrato = require('../models/contratoModel');

const ContratoController = {
    /**
     * Obtener todos los contratos.
     */
    getAllContratos: async (req, res) => {
        try {
            const contratos = await Contrato.getAllContratos();
            res.status(200).json(contratos);
        } catch (error) {
            console.error('Error al obtener contratos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    /**
     * Obtener un contrato por ID.
     */
    getContratoById: async (req, res) => {
        const { id } = req.params;
        try {
            const contrato = await Contrato.getContratoById(id);
            if (!contrato) {
                return res.status(404).json({ error: 'Contrato no encontrado' });
            }
            res.status(200).json(contrato);
        } catch (error) {
            console.error('Error al obtener contrato por ID:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    /**
     * Crear un nuevo contrato.
     */
    addContrato: async (req, res) => {
        const contratoData = req.body;
        try {
            const nuevoContrato = await Contrato.addContrato(contratoData);
            res.status(201).json(nuevoContrato);
        } catch (error) {
            console.error('Error al agregar contrato:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    /**
     * Actualizar un contrato por ID.
     */
    updateContrato: async (req, res) => {
        const { id } = req.params;
        const contratoData = req.body;
        try {
            const contratoActualizado = await Contrato.updateContrato(id, contratoData);
            if (!contratoActualizado) {
                return res.status(404).json({ error: 'Contrato no encontrado' });
            }
            res.status(200).json(contratoActualizado);
        } catch (error) {
            console.error('Error al actualizar contrato:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    /**
     * Eliminar un contrato por ID.
     */
    deleteContrato: async (req, res) => {
        const { id } = req.params;
        try {
            const eliminado = await Contrato.deleteContrato(id);
            if (!eliminado) {
                return res.status(404).json({ error: 'Contrato no encontrado' });
            }
            res.status(200).json({ message: 'Contrato eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar contrato:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = ContratoController;
