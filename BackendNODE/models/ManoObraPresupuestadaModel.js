const pool = require('../config/db.config');

const ManoDeObraPresupuestada = {
    /**
     * Agrega una nueva mano de obra presupuestada.
     * @param {Object} data - Datos de la mano de obra presupuestada.
     * @returns {Promise<Object>} - Retorna la mano de obra presupuestada agregada.
     */
    addManoDeObraPresupuestada: async (data) => {
        try {
            const query = `
                INSERT INTO MANO_DE_OBRA_PRESUPUESTADA (
                    ID_PRESUPUESTO, NOMBRE_PIEZA_MANO_DE_OBRA, CANTIDAD_PIEZAS_MANO_OBRA, ID_TARIFA_MANO_DE_OBRA
                ) VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const values = [
                data.id_presupuesto,
                data.nombre_pieza_mano_obra,
                data.cantidad_piezas_mano_obra,
                data.id_tarifa_mano_de_obra
            ];
            
            const result = await pool.query(query, values);
            return result.rows[0]; // Retorna la fila insertada
        } catch (error) {
            console.error('Error al agregar mano de obra presupuestada:', error);
            throw error;
        }
    },

    /**
     * Obtiene todas las manos de obra presupuestadas para un presupuesto específico.
     * @param {number} idPresupuesto - ID del presupuesto.
     * @returns {Promise<Array>} - Retorna una lista de manos de obra presupuestadas.
     */
    getManoDeObraByPresupuesto: async (idPresupuesto) => {
        try {
            const query = `
                SELECT * FROM MANO_DE_OBRA_PRESUPUESTADA
                WHERE ID_PRESUPUESTO = $1;
            `;
            const values = [idPresupuesto];

            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener mano de obra presupuestada:', error);
            throw error;
        }
    },

    /**
     * Elimina una mano de obra presupuestada por su ID.
     * @param {number} idManoObra - ID de la mano de obra presupuestada.
     * @returns {Promise<number|null>} - Retorna el ID eliminado o null si no existe.
     */
    deleteManoDeObraPresupuestada: async (idManoObra) => {
        try {
            const query = `
                DELETE FROM MANO_DE_OBRA_PRESUPUESTADA
                WHERE ID_MANO_OBRA = $1
                RETURNING ID_MANO_OBRA;
            `;
            const values = [idManoObra];

            const result = await pool.query(query, values);
            return result.rowCount > 0 ? result.rows[0].id_mano_obra : null;
        } catch (error) {
            console.error('Error al eliminar mano de obra presupuestada:', error);
            throw error;
        }
    },
    /**
     * Obtiene la suma total del precio de toda la mano de obra presupuestada para un presupuesto específico.
     * @param {number} idPresupuesto - ID del presupuesto.
     * @returns {Promise<number>} - Total del precio de mano de obra presupuestada.
     */
    async getTotalManoObraPresupuestada(idPresupuesto) {
        try {
            const query = `
                SELECT COALESCE(SUM(mop.CANTIDAD_PIEZAS_MANO_OBRA * tmo.PRECIO_POR_PIEZA_MANO_DE_OBRA), 0) AS total_mano_obra_presupuestada
                FROM MANO_DE_OBRA_PRESUPUESTADA mop
                JOIN TARIFA_MANO_DE_OBRA tmo ON mop.ID_TARIFA_MANO_DE_OBRA = tmo.ID_TARIFA_MANO_DE_OBRA
                WHERE mop.ID_PRESUPUESTO = $1;
            `;
            const { rows } = await pool.query(query, [idPresupuesto]);
            return rows.length ? rows[0].total_mano_obra_presupuestada : 0;
        } catch (error) {
            console.error("Error al obtener el total de mano de obra presupuestada:", error);
            throw error;
        }
    }
};

module.exports = ManoDeObraPresupuestada;
