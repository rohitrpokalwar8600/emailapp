const express = require("express");
const nodemailer = require("nodemailer");
// const EmailLog = require("../models/EmailLog");
const { requireAuth } = require("../middleware/auth");
const multer = require("multer");
const csv = require("csv-parser");
const stream = require("stream");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// GET /sendemailapp
router.get("/sendemailapp", requireAuth, (req, res) => {
  res.render("dashboard", { error: null, success: null });
});

// POST /send-email
router.post(
  "/send-email",
  requireAuth,
  upload.single("csvFile"),
  async (req, res) => {
    const { receivers, subject, message, senderName, messageType } = req.body;
    let receiverList = [];
    if (req.file) {
      // Parse CSV
      const results = [];
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve())
          .on("error", reject);
      });
      receiverList = results
        .map((row) => {
          const email = row.email || Object.values(row)[0];
          return email ? email.trim() : null;
        })
        .filter(
          (email) =>
            email && validateEmail(email) && email !== req.session.emailUser
        );
    } else {
      receiverList = receivers
        .split(",")
        .map((email) => email.trim())
        .filter(
          (email) =>
            email && validateEmail(email) && email !== req.session.emailUser
        ); // Support comma-separated multiple emails, exclude sender's email
    }

    try {
      if (receiverList.length === 0) {
        return res.render("dashboard", {
          error: "No valid receivers provided (sender's email excluded).",
          success: null,
        });
      }

      // Nodemailer transporter using session data
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: req.session.emailUser,
          pass: req.session.emailPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      let from = req.session.emailUser;
      if (senderName && senderName.trim()) {
        from = `"${senderName.trim()}" <${req.session.emailUser}>`;
      }

      // Send individual emails to each receiver
      for (const receiver of receiverList) {
        const mailOptions = {
          from: from,
          to: receiver,
          subject: subject,
        };

        if (messageType === "html") {
          mailOptions.html = message;
        } else {
          mailOptions.text = message;
        }

        await transporter.sendMail(mailOptions);
      }

      // Log to DB (commented out)
      /*
      const emailLog = new EmailLog({
        user: req.session.userId,
        receivers: receiverList,
        subject,
        message,
        messageType: messageType || "text",
      });
      await emailLog.save();
      */

      res.render("dashboard", {
        error: null,
        success: `Email sent to ${receiverList.length} receivers successfully!`,
      });
    } catch (err) {
      console.error(err);
      res.render("dashboard", { error: "Failed to send email", success: null });
    }
  }
);

module.exports = router;
