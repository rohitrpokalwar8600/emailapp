require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
// const User = require("./models/User");
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
// const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_change_in_production",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

/*
// MongoDB Connection
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/email-sender-db";
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedInitialUser();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
*/

// Seed initial user if not exists
/*
async function seedInitialUser() {
  try {
    const existingUser = await User.findOne({ username: "RohitRPokalwar" });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("1234", 10);
      const user = new User({
        username: "RohitRPokalwar",
        password: hashedPassword,
      });
      await user.save();
      console.log("Initial user seeded: RohitRPokalwar");
    }
  } catch (err) {
    console.error("Error seeding user:", err);
  }
}
*/

// Root route
app.get("/", (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect("/sendemailapp");
  } else {
    res.redirect("/login");
  }
});

// Routes
app.use("/", authRoutes);
app.use("/", emailRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
