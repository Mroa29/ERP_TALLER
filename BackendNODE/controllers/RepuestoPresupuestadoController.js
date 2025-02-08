const RepuestoPresupuestado = require('../models/RepuestosPresupuestdosModel');

const RepuestoPresupuestadoController = {
    /**
     * Agrega un nuevo repuesto presupuestado.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    addRepuestoPresupuestado: async (req, res) => {
        try {
            const repuesto = req.body;

            // Validaciones básicas
            if (!repuesto.id_presupuesto || !repuesto.nombre_pieza_repuesto || !repuesto.precio_pieza_repuesto) {
                return res.status(400).json({ message: "Todos los campos son obligatorios." });
            }

            // Agregar el repuesto presupuestado a la base de datos
            const newRepuesto = await RepuestoPresupuestado.addRepuestoPresupuestado(repuesto);

            res.status(201).json({
                message: "Repuesto presupuestado agregado exitosamente.",
                repuesto: newRepuesto
            });
        } catch (error) {
            console.error("Error al agregar repuesto presupuestado:", error);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    },

    /**
     * Elimina un repuesto presupuestado por su ID.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    deleteRepuestoPresupuestado: async (req, res) => {
        try {
            const { id } = req.params;

            // Eliminar el repuesto y obtener el ID eliminado
            const deletedId = await RepuestoPresupuestado.deleteRepuestoPresupuestado(id);

            if (!deletedId) {
                return res.status(404).json({ message: "Repuesto presupuestado no encontrado." });
            }

            res.status(200).json({
                message: "Repuesto presupuestado eliminado exitosamente.",
                id: deletedId
            });
        } catch (error) {
            console.error("Error al eliminar repuesto presupuestado:", error);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    },

    /**
     * Obtiene todos los repuestos presupuestados por ID de presupuesto.
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} res - Objeto de respuesta HTTP.
     */
    getRepuestosByPresupuesto: async (req, res) => {
        try {
            const { idPresupuesto } = req.params;

            if (!idPresupuesto) {
                return res.status(400).json({ message: "ID de presupuesto es obligatorio." });
            }

            const repuestos = await RepuestoPresupuestado.getRepuestosByPresupuesto(idPresupuesto);

            res.status(200).json(repuestos);
        } catch (error) {
            console.error("Error al obtener repuestos presupuestados:", error);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    },
    /**
     * Obtiene la suma total de los repuestos presupuestados para un presupuesto.
     * @param {Object} req - Objeto de la solicitud HTTP.
     * @param {Object} res - Objeto de la respuesta HTTP.
     */
    async getTotalRepuestosPresupuestados(req, res) {
        try {
            const { idPresupuesto } = req.params;
            const totalRepuestos = await RepuestoPresupuestado.getTotalRepuestosPresupuestados(idPresupuesto);

            res.json({ total_repuestos_presupuestados: totalRepuestos });
        } catch (error) {
            console.error("Error al obtener el total de repuestos presupuestados:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
};

module.exports = RepuestoPresupuestadoController;
