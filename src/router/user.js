const express = require("express");
const userController = require("../app/controllers/userController");
const router = express.Router();
require("dotenv").config();

router.get("/user", userController.getByToken);
router.get("/user/:id", userController.getById);
router.get("/users", userController.getAll);
router.delete("/user/:id", userController.delete);
router.put("/user/:id", userController.update);

module.exports = router;
