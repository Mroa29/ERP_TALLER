const InsumoModel = require("../models/insumoModel");

const InsumoController = {
    // 📌 Obtener todos los insumos
    getAllInsumos: async (req, res) => {
        try {
            const insumos = await InsumoModel.getAllInsumos();
            res.status(200).json(insumos);
        } catch (error) {
            console.error("Error al obtener los insumos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // 📌 Obtener insumos por ID de sucursal
    getInsumosBySucursal: async (req, res) => {
        try {
            const { idSucursal } = req.params;
            const insumos = await InsumoModel.getInsumosBySucursal(idSucursal);
            res.status(200).json(insumos);
        } catch (error) {
            console.error("Error al obtener insumos por sucursal:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // 📌 Obtener un insumo por ID
    getInsumoById: async (req, res) => {
        try {
            const { idInsumo } = req.params;
            const insumo = await InsumoModel.getInsumoById(idInsumo);
            if (!insumo) {
                return res.status(404).json({ error: "Insumo no encontrado" });
            }
            res.status(200).json(insumo);
        } catch (error) {
            console.error("Error al obtener insumo por ID:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // 📌 Agregar un nuevo insumo
    addInsumo: async (req, res) => {
    try {
        const { descripcion, formato, precio, stock_minimo, stock_maximo, stock_disponible, id_sucursal } = req.body;

        // 📌 Verificar que los campos requeridos existan (permitiendo stock_disponible = 0)
        if (!descripcion || !formato || !precio || stock_minimo === undefined ||
            stock_maximo === undefined || stock_disponible === undefined || !id_sucursal) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // 📌 Calcular stock crítico (true si stock disponible es menor que stock mínimo)
        const stock_critico = stock_disponible < stock_minimo;

        // 📌 Insertar en la base de datos
        const nuevoInsumo = await InsumoModel.addInsumo({
            descripcion,
            formato,
            precio,
            stock_minimo,
            stock_maximo,
            stock_disponible,
            stock_critico,
            id_sucursal
        });

        res.status(201).json(nuevoInsumo);
    } catch (error) {
        console.error("Error al agregar insumo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
    },



        /// 📌 Actualizar solo el stock disponible y el stock crítico de un insumo
        updateStockInsumo: async (req, res) => {
            try {
                const idInsumo = req.params.id; // Obtener ID del insumo desde la URL
                const { stock_disponible, stock_critico } = req.body; // Obtener datos del cuerpo de la solicitud

                // 📌 Validar si el ID del insumo es válido
                if (!idInsumo || isNaN(idInsumo)) {
                    return res.status(400).json({ error: "ID de insumo inválido." });
                }

                // 📌 Validar si los valores están presentes
                if (stock_disponible === undefined || stock_critico === undefined) {
                    return res.status(400).json({ error: "Todos los campos son obligatorios." });
                }

                console.log("📌 Datos recibidos para actualización:", { idInsumo, stock_disponible, stock_critico });

                // 📌 Llamar al modelo para actualizar el stock
                const insumoActualizado = await InsumoModel.updateStockInsumo(idInsumo, stock_disponible, stock_critico);

                // 📌 Verificar si la actualización fue exitosa
                if (!insumoActualizado) {
                    return res.status(404).json({ error: "Insumo no encontrado o no actualizado." });
                }

                console.log("✅ Insumo actualizado correctamente:", insumoActualizado);

                // 📌 Retornar el insumo actualizado
                res.status(200).json({ mensaje: "Stock actualizado correctamente", insumo: insumoActualizado });

            } catch (error) {
                console.error("❌ Error al actualizar el stock del insumo:", error);
                res.status(500).json({ error: "Error interno del servidor" });
            }
        },




    // 📌 Eliminar un insumo por ID
    deleteInsumo: async (req, res) => {
        try {
            const { idInsumo } = req.params;
            const eliminado = await InsumoModel.deleteInsumo(idInsumo);

            if (!eliminado) {
                return res.status(404).json({ error: "Insumo no encontrado" });
            }

            res.status(200).json({ mensaje: "Insumo eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar insumo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

module.exports = InsumoController;
