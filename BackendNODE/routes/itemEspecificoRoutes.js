const express = require("express");
const router = express.Router();
const ItemEspecificoController = require("../controllers/ItemEspecificoController");

// 📌 Obtener todos los ítems específicos
router.get("/", ItemEspecificoController.getAllItems);

// 📌 Obtener un ítem específico por ID
router.get("/:id", ItemEspecificoController.getItemById);

// 📌 Obtener la suma total de `CANTIDAD_INSUMO` por `ID_INSUMO` y `ID_SUCURSAL`
router.get("/total-stock/:idInsumo/:idSucursal", ItemEspecificoController.getTotalStockByInsumoAndSucursal);

// 📌 Agregar un nuevo ítem específico
router.post("/", ItemEspecificoController.addItem);

// 📌 Eliminar un ítem específico por ID
router.delete("/:id", ItemEspecificoController.deleteItemById);

module.exports = router;
