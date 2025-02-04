const ItemEspecificoModel = require("../models/ItemEspecificoModel");

const ItemEspecificoController = {
    // 📌 Obtener todos los ítems específicos
    getAllItems: async (req, res) => {
        try {
            const items = await ItemEspecificoModel.getAllItems();
            res.status(200).json(items);
        } catch (error) {
            console.error("Error al obtener los ítems específicos:", error);
            res.status(500).json({ error: "Error al obtener los ítems específicos." });
        }
    },

    // 📌 Obtener un ítem específico por ID
    getItemById: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await ItemEspecificoModel.getItemById(id);
            if (!item) {
                return res.status(404).json({ error: "Ítem no encontrado." });
            }
            res.status(200).json(item);
        } catch (error) {
            console.error("Error al obtener el ítem específico:", error);
            res.status(500).json({ error: "Error al obtener el ítem específico." });
        }
    },

    // 📌 Obtener la suma total de `CANTIDAD_INSUMO` por `ID_INSUMO` y `ID_SUCURSAL`
    getTotalStockByInsumoAndSucursal: async (req, res) => {
        try {
            const { idInsumo, idSucursal } = req.params;
            const totalStock = await ItemEspecificoModel.getTotalStockByInsumoAndSucursal(idInsumo, idSucursal);
            res.status(200).json({ id_insumo: idInsumo, id_sucursal: idSucursal, total_stock: totalStock });
        } catch (error) {
            console.error("Error al obtener la suma total de stock:", error);
            res.status(500).json({ error: "Error al obtener la suma total de stock." });
        }
    },

    // 📌 Agregar un nuevo ítem específico
    addItem: async (req, res) => {
        try {
            const { cantidad_insumo, caducidad_insumo, id_insumo, id_sucursal } = req.body;

            if (!cantidad_insumo || !caducidad_insumo || !id_insumo || !id_sucursal) {
                return res.status(400).json({ error: "Todos los campos son obligatorios." });
            }

            const newItem = await ItemEspecificoModel.addItem({
                cantidad_insumo,
                caducidad_insumo,
                id_insumo,
                id_sucursal
            });

            res.status(201).json({ mensaje: "Ítem específico agregado con éxito.", item: newItem });
        } catch (error) {
            console.error("Error al agregar un nuevo ítem específico:", error);
            res.status(500).json({ error: "Error al agregar el ítem específico." });
        }
    },

    // 📌 Eliminar un ítem específico por ID
    deleteItemById: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedItem = await ItemEspecificoModel.deleteItemById(id);
            if (!deletedItem) {
                return res.status(404).json({ error: "Ítem no encontrado." });
            }
            res.status(200).json({ mensaje: "Ítem específico eliminado con éxito.", item: deletedItem });
        } catch (error) {
            console.error("Error al eliminar el ítem específico:", error);
            res.status(500).json({ error: "Error al eliminar el ítem específico." });
        }
    }
};

module.exports = ItemEspecificoController;
