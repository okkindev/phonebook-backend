const express = require("express");
const {
  addContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteContact,
  shareContact,
  unshareContact,
} = require("../controllers/contactController");
const authMiddleware = require("../middleware/AuthMiddleware");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/", authMiddleware, upload.single("file"), addContact);
router.get("/", authMiddleware, getAllContacts);
router.get("/:id", authMiddleware, getContact);
router.put("/:id", authMiddleware, upload.single("file"), updateContact);
router.delete("/:id", authMiddleware, deleteContact);
router.post("/share/:id", authMiddleware, shareContact);
router.post("/unshare", authMiddleware, unshareContact);

module.exports = router;
