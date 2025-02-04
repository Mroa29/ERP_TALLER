const pool = require("../config/db.config");

const ItemEspecificoModel = {
    // 📌 Obtener todos los ítems específicos
    getAllItems: async () => {
        try {
            const query = "SELECT * FROM ITEM_ESPECIFICO";
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error al obtener los ítems específicos:", error);
            throw error;
        }
    },

    // 📌 Obtener un ítem específico por ID
    getItemById: async (id) => {
        try {
            const query = "SELECT * FROM ITEM_ESPECIFICO WHERE ID_ITEM_ESPECIFICO = $1";
            const result = await pool.query(query, [id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error("Error al obtener el ítem específico por ID:", error);
            throw error;
        }
    },

    // 📌 Obtener la suma total de `CANTIDAD_INSUMO` por `ID_INSUMO` y `ID_SUCURSAL`
    getTotalStockByInsumoAndSucursal: async (idInsumo, idSucursal) => {
        try {
            const query = `
                SELECT SUM(CANTIDAD_INSUMO) AS total_stock
                FROM ITEM_ESPECIFICO
                WHERE ID_INSUMO = $1 AND ID_SUCURSAL = $2
            `;
            const result = await pool.query(query, [idInsumo, idSucursal]);
            return result.rows[0].total_stock || 0;  // Si no hay registros, retorna 0
        } catch (error) {
            console.error("Error al obtener la suma total de stock:", error);
            throw error;
        }
    },

    // 📌 Agregar un nuevo ítem específico
    addItem: async (item) => {
        try {
            const query = `
                INSERT INTO ITEM_ESPECIFICO (CANTIDAD_INSUMO, CADUCIDAD_INSUMO, ID_INSUMO, ID_SUCURSAL)
                VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            const values = [
                item.cantidad_insumo,
                item.caducidad_insumo,
                item.id_insumo,
                item.id_sucursal
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error al agregar un nuevo ítem específico:", error);
            throw error;
        }
    },

    // 📌 Eliminar un ítem específico por ID
    deleteItemById: async (id) => {
        try {
            const query = "DELETE FROM ITEM_ESPECIFICO WHERE ID_ITEM_ESPECIFICO = $1 RETURNING *";
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al eliminar el ítem específico:", error);
            throw error;
        }
    }
};

module.exports = ItemEspecificoModel;
