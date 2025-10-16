const express = require("express");
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /login
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// POST /login
router.post("/login", async (req, res) => {
  const { username, password, emailUser, emailPass } = req.body;
  // Dummy login without DB
  if (username === "RohitRPokalwar" && password === "8600") {
    req.session.userId = "dummy";
    req.session.emailUser = emailUser;
    req.session.emailPass = emailPass;
    res.redirect("/sendemailapp");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

// GET /logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/login");
  });
});

// GET /change-password
router.get("/change-password", requireAuth, (req, res) => {
  res.render("change-password", { error: null, success: null });
});

// POST /change-password
router.post("/change-password", requireAuth, async (req, res) => {
  // Dummy change password
  res.render("change-password", {
    error: null,
    success: "Password changed successfully (dummy)",
  });
});

module.exports = router;
