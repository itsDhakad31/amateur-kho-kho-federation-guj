import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// --- MongoDB Schemas ---

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Player' },
  created_at: { type: Date, default: Date.now }
});

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: 'Upcoming' },
  created_at: { type: Date, default: Date.now }
});

const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  address_city: { type: String, required: true },
  address_country: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  experience: { type: String, required: true },
  role: { type: String, required: true },
  doc_photo: String,
  doc_aadhar: String,
  doc_pan: String,
  doc_birth: String,
  level_passing: String,
  year_passing: String,
  coaching_cert: String,
  edu_qualification: String,
  referee_cert: String,
  status: { type: String, default: 'Pending' },
  unique_id: String,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const News = mongoose.model("News", NewsSchema);
const Event = mongoose.model("Event", EventSchema);
const Registration = mongoose.model("Registration", RegistrationSchema);

// --- Database Initialization ---

let isConnected = false;
let initError: string | null = null;

const connectDB = async (retries = 10) => { // Increased retries
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    initError = "MONGODB_URI not found in environment variables";
    console.error(initError);
    return;
  }

  while (retries > 0) {
    try {
      console.log(`Attempting to connect to MongoDB... (${retries} retries left)`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000 // Fail faster
      });
      isConnected = true;
      console.log("MongoDB connected successfully");
      await seedData();
      return;
    } catch (error: any) {
      initError = `MongoDB connection error: ${error.message}`;
      console.error(initError);
      retries -= 1;
      if (retries === 0) break;
      console.log("Retrying connection in 1 second..."); // Faster retry
      await new Promise(res => setTimeout(res, 1000));
    }
  }
  console.error("Failed to connect to MongoDB after multiple attempts.");
};

// ... (rest of the file)

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Start DB connection in background
  connectDB();

  // Middleware to check DB connection for API routes
  app.use('/api', (req, res, next) => {
    // Allow health checks and debug endpoints even if DB is down
    if (req.path === '/health' || req.path === '/ping' || req.path.startsWith('/debug')) {
      return next();
    }
    
    if (!isConnected) {
      return res.status(503).json({ 
        error: "Service Unavailable", 
        message: "Database connection is initializing. Please try again in a moment.",
        details: initError
      });
    }
    next();
  });

  // Increase payload limit to handle base64 images
  app.use(express.json({ limit: '50mb' }));
  
  // ... (rest of startServer)

  // Simple health check
  app.get("/api/ping", (req, res) => {
    res.json({ message: "pong", timestamp: new Date().toISOString() });
  });

  app.get("/api/debug/db", (req, res) => {
    res.json({
      dbConnected: isConnected,
      initError: initError,
      hasEnvVar: !!process.env.MONGODB_URI
    });
  });

  app.post("/api/debug/db/reconnect", async (req, res) => {
    if (isConnected) {
      return res.json({ success: true, message: "Already connected" });
    }
    console.log("Manual reconnection attempt...");
    await connectDB();
    res.json({ 
      success: isConnected, 
      error: initError 
    });
  });

  app.post("/api/debug/db/reset", async (req, res) => {
    if (!isConnected) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      console.log("Resetting database...");
      await mongoose.connection.dropDatabase();
      await seedData();
      res.json({ success: true, message: "Database reset successfully" });
    } catch (error: any) {
      console.error("Database reset failed:", error);
      res.status(500).json({ error: "Reset failed: " + error.message });
    }
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'Player'
      });
      
      const user = { id: newUser._id, name, email, role: newUser.role };
      const token = jwt.sign(user, JWT_SECRET);
      res.json({ user, token });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    try {
      const userData = await User.findOne({ email });
      
      if (!userData) {
        console.log(`Login failed: User ${email} not found`);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (isPasswordValid) {
        console.log(`Login successful: ${email}`);
        const user = { id: userData._id, name: userData.name, email: userData.email, role: userData.role };
        const token = jwt.sign(user, JWT_SECRET);
        res.json({ user, token });
      } else {
        console.log(`Login failed: Invalid password for ${email}`);
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json(req.user);
  });

  // API Routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await News.find().sort({ date: -1 });
      res.json(news.map(n => ({ ...n.toObject(), id: n._id })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await Event.find().sort({ date: 1 });
      res.json(events.map(e => ({ ...e.toObject(), id: e._id })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/admin/events", authenticateToken, isAdmin, async (req, res) => {
    const { title, date, location, category, status } = req.body;
    try {
      const newEvent = await Event.create({
        title,
        date,
        location,
        category,
        status: status || 'Upcoming'
      });
      res.json({ success: true, id: newEvent._id });
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.delete("/api/admin/events/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await Event.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  app.post("/api/register", async (req, res) => {
    const data = req.body;
    try {
      const newReg = await Registration.create({
        ...data,
        status: 'Pending'
      });
      res.json({ success: true, id: newReg._id });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.get("/api/registrations/me", authenticateToken, async (req: any, res) => {
    try {
      const reg = await Registration.findOne({ email: req.user.email });
      if (!reg) return res.json(null);
      res.json({ ...reg.toObject(), id: reg._id });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registration" });
    }
  });

  // Admin Routes
  app.get("/api/admin/registrations", authenticateToken, isAdmin, async (req, res) => {
    try {
      const regs = await Registration.find().sort({ created_at: -1 });
      res.json(regs.map(r => ({ ...r.toObject(), id: r._id })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  app.put("/api/admin/registrations/:id/status", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const reg = await Registration.findById(id);
      
      if (!reg) {
        return res.status(404).json({ error: "Registration not found" });
      }

      reg.status = status;

      if (status === 'Approved' && !reg.unique_id) {
        reg.unique_id = await generateUniqueID(reg.role);
      }

      await reg.save();
      res.json({ success: true });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.delete("/api/admin/registrations/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      await Registration.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete registration error:", error);
      res.status(500).json({ error: "Failed to delete registration" });
    }
  });

  app.get("/api/admin/stats", authenticateToken, isAdmin, async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      const regCount = await Registration.countDocuments();
      const pendingCount = await Registration.countDocuments({ status: "Pending" });
      
      res.json({
        users: userCount,
        registrations: regCount,
        pending: pendingCount
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Serve static files from dist
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not Found' });
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
