const Router = require("express");
const emailController = require("../controllers/email.controller.js");

const router = Router();

router.post("/contact", emailController.sendContactForm);

module.exports = router;