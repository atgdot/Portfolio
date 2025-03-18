import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const app = express();
const port = 3000;

dotenv.config(); // Load environment variables

// Middleware to parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from "Public"



// Set Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.lineicons.com; " +
    "font-src 'self' data: https://fonts.gstatic.com https://cdn.lineicons.com; " +
    "connect-src 'self' https://cdn.lineicons.com; " +  // Added for font fetching
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
    "img-src 'self' data:;"
  );
  next();
});





// Nodemailer configuration
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


// Handle form submission
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
    console.error("Error sending email:", error);  // Log error for debugging
    res.status(500).json({ success: false, error: "Failed to send email", details: error.message });
  }
});
// Routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/services", (req, res) => {
  res.render("services.ejs");
});

app.get("/portfolio", (req, res) => {
  res.render("portfolio.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(express.static("Public"));
