const pool = require("../config/db.config");

const InsumoModel = {
    // 📌 Obtener todos los insumos
    getAllInsumos: async () => {
        try {
            const query = `SELECT * FROM INSUMO`;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error al obtener los insumos:", error);
            throw error;
        }
    },

    // 📌 Obtener insumos por ID de sucursal
    getInsumosBySucursal: async (idSucursal) => {
        try {
            const query = `SELECT * FROM INSUMO WHERE ID_SUCURSAL = $1`;
            const result = await pool.query(query, [idSucursal]);
            return result.rows;
        } catch (error) {
            console.error("Error al obtener insumos por sucursal:", error);
            throw error;
        }
    },

    // 📌 Obtener un insumo por su ID
    getInsumoById: async (idInsumo) => {
        try {
            const query = `SELECT * FROM INSUMO WHERE ID_INSUMO = $1`;
            const result = await pool.query(query, [idInsumo]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error("Error al obtener el insumo por ID:", error);
            throw error;
        }
    },

    // 📌 Agregar un nuevo insumo
    addInsumo: async (insumo) => {
      try {
          const query = `
              INSERT INTO INSUMO (
                  DESCRIPCION_INSUMO, FORMATO_INSUMO, PRECIO_INSUMO, STOCK_MINIMO_INSUMO, 
                  STOCK_MAXIMO_INSUMO, STOCK_DISPONIBLE_INSUMO, STOCK_CRITICO_INSUMO, ID_SUCURSAL
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
          `;
          const values = [
              insumo.descripcion,
              insumo.formato,
              insumo.precio,
              insumo.stock_minimo,
              insumo.stock_maximo,
              insumo.stock_disponible,
              insumo.stock_critico, // 📌 Ahora se recibe directamente en lugar de calcular aquí
              insumo.id_sucursal
          ];
          const result = await pool.query(query, values);
          return result.rows[0];
      } catch (error) {
          console.error("Error al agregar un nuevo insumo:", error);
          throw error;
      }
    },


   // 📌 Actualizar solo el stock disponible y el stock crítico de un insumo
        updateStockInsumo: async (idInsumo, stockDisponible, stockCritico) => {
            try {
                const query = `
                    UPDATE INSUMO 
                    SET STOCK_DISPONIBLE_INSUMO = $1, 
                        STOCK_CRITICO_INSUMO = $2
                    WHERE ID_INSUMO = $3 
                    RETURNING *;
                `;
                const values = [stockDisponible, stockCritico, idInsumo];

                const result = await pool.query(query, values);
                return result.rows[0];
            } catch (error) {
                console.error("❌ Error al actualizar el stock del insumo:", error);
                throw error;
            }
        },



    // 📌 Eliminar un insumo
    deleteInsumo: async (idInsumo) => {
        try {
            const query = `DELETE FROM INSUMO WHERE ID_INSUMO = $1 RETURNING *`;
            const result = await pool.query(query, [idInsumo]);
            return result.rowCount > 0;
        } catch (error) {
            console.error("Error al eliminar insumo:", error);
            throw error;
        }
    }
};

module.exports = InsumoModel;
