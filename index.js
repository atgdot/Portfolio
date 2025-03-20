import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Resolve __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Set the View Engine & View Directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Serve Static Files (Ensure correct folder name: "public" or "Public")
app.use(express.static(path.join(__dirname, "Public")));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Security Headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.lineicons.com; " +
      "font-src 'self' https://fonts.gstatic.com https://cdn.lineicons.com data: blob: https://ayush-portfolio-hoh0145rk-atgdots-projects.vercel.app; " +
      "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
      "img-src 'self' data: https://ayush-portfolio-hoh0145rk-atgdots-projects.vercel.app;"
  );
  next();
});

// ✅ Start the Server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${port}`);
});

// ✅ Nodemailer Configuration (Check if ENV variables exist)
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  console.error("❌ ERROR: Missing GMAIL_USER or GMAIL_PASS in .env");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ✅ Handle Contact Form Submission
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    let mailOptions = {
      from: email,
      to: process.env.GMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email", details: error.message });
  }
});

// ✅ Define Routes
app.get("/", (req, res) => res.render("index"));
app.get("/about", (req, res) => res.render("about"));
app.get("/services", (req, res) => res.render("services"));
app.get("/portfolio", (req, res) => res.render("portfolio"));
app.get("/contact", (req, res) => res.render("contact"));

// ✅ Export app (Only needed for Vercel, remove if using PM2)
export default app;
