// server/routes/rag.js
const express = require("express");
const router = express.Router();
const ragController = require("../controllers/ragController");

router.get("/search", ragController.search);
router.get("/blogs/:id/related", ragController.related);
router.post("/ask", ragController.ask);

module.exports = router;
