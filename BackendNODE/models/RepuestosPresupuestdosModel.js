const pool = require('../config/db.config');

const RepuestoPresupuestado = {
    /**
     * Agrega un nuevo repuesto presupuestado a la base de datos.
     * @param {Object} repuesto - Datos del repuesto presupuestado.
     * @returns {Promise<Object>} - Retorna el repuesto insertado con su ID.
     */
    addRepuestoPresupuestado: async (repuesto) => {
        try {
            const query = `
                INSERT INTO REPUESTOS_PRESUPUESTADOS (ID_PRESUPUESTO, NOMBRE_PIEZA_REPUESTO, PRECIO_PIEZA_REPUESTO, ID_DOCUMENTO)
                VALUES ($1, $2, $3, $4)
                RETURNING ID_REPUESTOS_PRESUPUESTADO;
            `;
            const values = [
                repuesto.id_presupuesto,
                repuesto.nombre_pieza_repuesto,
                repuesto.precio_pieza_repuesto,
                repuesto.id_documento || null
            ];

            const result = await pool.query(query, values);
            return result.rows[0]; // Retorna el ID generado
        } catch (error) {
            console.error('Error al agregar repuesto presupuestado:', error);
            throw error;
        }
    },

    /**
     * Elimina un repuesto presupuestado por su ID y devuelve el ID eliminado.
     * @param {number} id - ID del repuesto presupuestado a eliminar.
     * @returns {Promise<number | null>} - Retorna el ID eliminado o null si no existe.
     */
    deleteRepuestoPresupuestado: async (id) => {
        try {
            const query = `
                DELETE FROM REPUESTOS_PRESUPUESTADOS
                WHERE ID_REPUESTOS_PRESUPUESTADO = $1
                RETURNING ID_REPUESTOS_PRESUPUESTADO;
            `;
            const values = [id];

            const result = await pool.query(query, values);
            return result.rowCount > 0 ? result.rows[0].id_repuestos_presupuestado : null;
        } catch (error) {
            console.error('Error al eliminar repuesto presupuestado:', error);
            throw error;
        }
    },

    /**
     * Obtiene todos los repuestos presupuestados por ID de presupuesto.
     * @param {number} idPresupuesto - ID del presupuesto.
     * @returns {Promise<Array>} - Lista de repuestos presupuestados asociados al presupuesto.
     */
    getRepuestosByPresupuesto: async (idPresupuesto) => {
        try {
            const query = `
                SELECT ID_REPUESTOS_PRESUPUESTADO, ID_PRESUPUESTO, NOMBRE_PIEZA_REPUESTO, PRECIO_PIEZA_REPUESTO, ID_DOCUMENTO
                FROM REPUESTOS_PRESUPUESTADOS
                WHERE ID_PRESUPUESTO = $1;
            `;
            const values = [idPresupuesto];

            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener repuestos por presupuesto:', error);
            throw error;
        }
    }
};

module.exports = RepuestoPresupuestado;
