const express = require("express");
const {
  getAllUsers,
  getUser,
  approveUser,
  deactivateUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/AuthMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUser);
router.post("/", authMiddleware, createUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/approve/:id", authMiddleware, approveUser);
router.put("/deactivate/:id", authMiddleware, deactivateUser);

module.exports = router;
