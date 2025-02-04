const express = require("express");
const CobroController = require("../controllers/CobrosController");

const router = express.Router();

/**
 * 📌 Rutas para gestionar cobros
 */

// ✅ Agregar un nuevo cobro
router.post("/", CobroController.addCobro);

// ✅ Obtener todos los cobros de un presupuesto
router.get("/presupuesto/:idPresupuesto", CobroController.getCobrosByPresupuesto);

// ✅ Editar un cobro por su ID
router.put("/:idCobro", CobroController.updateCobro);

// ✅ Eliminar un cobro por su ID
router.delete("/:idCobro", CobroController.deleteCobro);



router.get("/:id", CobroController.getCobroById);


module.exports = router;
