const express = require("express");
const router = express.Router();
const InsumoController = require("../controllers/insumoController");

// 📌 Actualizar solo el stock disponible y el stock crítico de un insumo
router.put("/stock/:id", InsumoController.updateStockInsumo);

// 📌 Obtener todos los insumos
router.get("/", InsumoController.getAllInsumos);

// 📌 Obtener un insumo por ID
router.get("/:idInsumo", InsumoController.getInsumoById);

// 📌 Obtener insumos por ID de sucursal
router.get("/sucursal/:idSucursal", InsumoController.getInsumosBySucursal);

// 📌 Agregar un nuevo insumo
router.post("/", InsumoController.addInsumo);


// 📌 Eliminar un insumo por ID
router.delete("/:idInsumo", InsumoController.deleteInsumo);

module.exports = router;
