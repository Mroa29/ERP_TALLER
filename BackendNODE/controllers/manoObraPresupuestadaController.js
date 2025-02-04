const ManoDeObraPresupuestada = require('../models/ManoObraPresupuestadaModel');

const ManoDeObraPresupuestadaController = {
    /**
     * Agrega una nueva mano de obra presupuestada.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    addManoDeObraPresupuestada: async (req, res) => {
        try {
            const { id_presupuesto, nombre_pieza_mano_obra, cantidad_piezas_mano_obra, id_tarifa_mano_de_obra } = req.body;

            // Validaciones básicas
            if (!id_presupuesto || !nombre_pieza_mano_obra || !cantidad_piezas_mano_obra || !id_tarifa_mano_de_obra) {
                return res.status(400).json({ message: "Todos los campos son obligatorios." });
            }

            const nuevaManoDeObra = await ManoDeObraPresupuestada.addManoDeObraPresupuestada(req.body);
            res.status(201).json({
                message: "Mano de obra presupuestada agregada exitosamente.",
                manoDeObra: nuevaManoDeObra
            });
        } catch (error) {
            console.error("Error al agregar mano de obra presupuestada:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    /**
     * Obtiene todas las manos de obra presupuestadas de un presupuesto específico.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    getManoDeObraByPresupuesto: async (req, res) => {
        try {
            const { id_presupuesto } = req.params;
            if (!id_presupuesto) {
                return res.status(400).json({ message: "El ID del presupuesto es obligatorio." });
            }

            const manoDeObra = await ManoDeObraPresupuestada.getManoDeObraByPresupuesto(id_presupuesto);
            res.status(200).json(manoDeObra);
        } catch (error) {
            console.error("Error al obtener mano de obra presupuestada:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    /**
     * Elimina una mano de obra presupuestada por su ID.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    deleteManoDeObraPresupuestada: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "El ID de la mano de obra presupuestada es obligatorio." });
            }

            const idEliminado = await ManoDeObraPresupuestada.deleteManoDeObraPresupuestada(id);
            if (!idEliminado) {
                return res.status(404).json({ message: "Mano de obra presupuestada no encontrada." });
            }

            res.status(200).json({
                message: "Mano de obra presupuestada eliminada exitosamente.",
                id: idEliminado
            });
        } catch (error) {
            console.error("Error al eliminar mano de obra presupuestada:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
};

module.exports = ManoDeObraPresupuestadaController;
