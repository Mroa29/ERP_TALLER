const TipoContrato = require('../models/tipocontratoModel');

const TipoContratoController = {
    /**
     * Obtener todos los tipos de contrato.
     */
    getAllTiposContrato: async (req, res) => {
        try {
            const tipos = await TipoContrato.getAllTiposContrato();
            res.status(200).json(tipos);
        } catch (error) {
            console.error('Error al obtener tipos de contrato:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    /**
     * Obtener un tipo de contrato por ID.
     */
    getTipoContratoById: async (req, res) => {
        const { id } = req.params;
        try {
            const tipoContrato = await TipoContrato.getTipoContratoById(id);
            if (!tipoContrato) {
                return res.status(404).json({ error: 'Tipo de contrato no encontrado' });
            }
            res.status(200).json(tipoContrato);
        } catch (error) {
            console.error('Error al obtener tipo de contrato por ID:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    /**
     * Crear un nuevo tipo de contrato.
     */
    addTipoContrato: async (req, res) => {
        const tipoContratoData = req.body;
        try {
            const nuevoTipoContrato = await TipoContrato.addTipoContrato(tipoContratoData);
            res.status(201).json(nuevoTipoContrato);
        } catch (error) {
            console.error('Error al agregar tipo de contrato:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    /**
     * Actualizar un tipo de contrato por ID.
     */
    updateTipoContrato: async (req, res) => {
        const { id } = req.params;
        const tipoContratoData = req.body;
        try {
            const tipoContratoActualizado = await TipoContrato.updateTipoContrato(id, tipoContratoData);
            if (!tipoContratoActualizado) {
                return res.status(404).json({ error: 'Tipo de contrato no encontrado' });
            }
            res.status(200).json(tipoContratoActualizado);
        } catch (error) {
            console.error('Error al actualizar tipo de contrato:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    /**
     * Eliminar un tipo de contrato por ID.
     */
    deleteTipoContrato: async (req, res) => {
        const { id } = req.params;
        try {
            const eliminado = await TipoContrato.deleteTipoContrato(id);
            if (!eliminado) {
                return res.status(404).json({ error: 'Tipo de contrato no encontrado' });
            }
            res.status(200).json({ message: 'Tipo de contrato eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar tipo de contrato:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = TipoContratoController;
