import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const db = new Database("akkfg.db");
const JWT_SECRET = process.env.JWT_SECRET || "akkfg-secret-key-2026";

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'Player',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    summary TEXT,
    date TEXT,
    image TEXT
  );
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    location TEXT,
    category TEXT,
    status TEXT
  );
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unique_id TEXT UNIQUE,
    name TEXT,
    dob TEXT,
    address_city TEXT,
    address_country TEXT,
    gender TEXT,
    email TEXT,
    mobile TEXT,
    experience TEXT,
    role TEXT, -- 'Coach' or 'Student'
    status TEXT DEFAULT 'Pending',
    -- Docs
    doc_photo TEXT,
    doc_aadhar TEXT,
    doc_pan TEXT,
    doc_birth TEXT,
    -- Student specific professional info
    level_passing TEXT,
    year_passing TEXT,
    coaching_cert TEXT,
    edu_qualification TEXT,
    referee_cert TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add missing columns to users table
const userTableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
const userColumns = userTableInfo.map(c => c.name);
if (!userColumns.includes('created_at')) {
  try {
    db.prepare("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP").run();
  } catch (e) {}
}

// Migration: Add missing columns to registrations table if they don't exist
const tableInfo = db.prepare("PRAGMA table_info(registrations)").all() as any[];
const columns = tableInfo.map(c => c.name);

const requiredColumns = [
  { name: 'unique_id', type: 'TEXT' },
  { name: 'address_city', type: 'TEXT' },
  { name: 'address_country', type: 'TEXT' },
  { name: 'email', type: 'TEXT' },
  { name: 'mobile', type: 'TEXT' },
  { name: 'experience', type: 'TEXT' },
  { name: 'doc_photo', type: 'TEXT' },
  { name: 'doc_aadhar', type: 'TEXT' },
  { name: 'doc_pan', type: 'TEXT' },
  { name: 'doc_birth', type: 'TEXT' },
  { name: 'level_passing', type: 'TEXT' },
  { name: 'year_passing', type: 'TEXT' },
  { name: 'coaching_cert', type: 'TEXT' },
  { name: 'edu_qualification', type: 'TEXT' },
  { name: 'referee_cert', type: 'TEXT' },
  { name: 'created_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
];

for (const col of requiredColumns) {
  if (!columns.includes(col.name)) {
    try {
      db.prepare(`ALTER TABLE registrations ADD COLUMN ${col.name} ${col.type}`).run();
      console.log(`Added missing column: ${col.name}`);
      
      // If it's unique_id, add a unique index separately
      if (col.name === 'unique_id') {
        db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_id ON registrations(unique_id)`).run();
      }
    } catch (e) {
      console.error(`Failed to add column ${col.name}:`, e);
    }
  }
}

// Ensure unique index for unique_id exists
if (columns.includes('unique_id')) {
  try {
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_id ON registrations(unique_id)`).run();
  } catch (e) {}
}

// Helper to generate unique ID
const generateUniqueID = (role: string) => {
  const prefix = role === 'Coach' ? 'AKKFG-C' : 'AKKFG-S';
  const count = db.prepare("SELECT COUNT(*) as count FROM registrations WHERE role = ?").get(role) as { count: number };
  const num = (count.count + 1).toString().padStart(4, '0');
  return `${prefix}-${num}`;
};

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware to verify Admin
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};

// Seed data if empty
const seedAdmin = async () => {
  const adminEmail = "admin@akkfg.in";
  const existingAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
      "Super Admin",
      adminEmail,
      hashedPassword,
      "Admin"
    );
    console.log("Admin user seeded: admin@akkfg.in / admin123");
  }
};
seedAdmin();

const newsCount = db.prepare("SELECT COUNT(*) as count FROM news").get() as { count: number };
if (newsCount.count === 0) {
  db.prepare("INSERT INTO news (title, summary, date, image) VALUES (?, ?, ?, ?)").run(
    "State Level Kho-Kho Championship 2026 Announced",
    "The Amateur Kho-Kho Federation Gujarat is proud to announce the upcoming state championship in Ahmedabad.",
    "2026-03-15",
    "https://picsum.photos/seed/khokho1/800/400"
  );
  db.prepare("INSERT INTO news (title, summary, date, image) VALUES (?, ?, ?, ?)").run(
    "New Coaching Certification Program",
    "Registration is now open for the Level 1 Coaching Certification program starting next month.",
    "2026-03-10",
    "https://picsum.photos/seed/coach/800/400"
  );
}

const eventCount = db.prepare("SELECT COUNT(*) as count FROM events").get() as { count: number };
if (eventCount.count === 0) {
  db.prepare("INSERT INTO events (title, date, location, category, status) VALUES (?, ?, ?, ?, ?)").run(
    "Gujarat State Senior Championship",
    "2026-04-05",
    "Ahmedabad",
    "Senior",
    "Upcoming"
  );
  db.prepare("INSERT INTO events (title, date, location, category, status) VALUES (?, ?, ?, ?, ?)").run(
    "U-17 District Tournament",
    "2026-03-25",
    "Surat",
    "U-17",
    "Upcoming"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const info = db.prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
      ).run(name, email, hashedPassword, role || 'Player');
      
      const user = { id: info.lastInsertRowid, name, email, role: role || 'Player' };
      const token = jwt.sign(user, JWT_SECRET);
      res.json({ user, token });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...userWithoutPassword } = user;
      const token = jwt.sign(userWithoutPassword, JWT_SECRET);
      res.json({ user: userWithoutPassword, token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json(req.user);
  });

  // API Routes
  app.get("/api/news", (req, res) => {
    const news = db.prepare("SELECT * FROM news ORDER BY date DESC").all();
    res.json(news);
  });

  app.get("/api/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events ORDER BY date ASC").all();
    res.json(events);
  });

  app.post("/api/admin/events", authenticateToken, isAdmin, (req, res) => {
    const { title, date, location, category, status } = req.body;
    try {
      const info = db.prepare(
        "INSERT INTO events (title, date, location, category, status) VALUES (?, ?, ?, ?, ?)"
      ).run(title, date, location, category, status || 'Upcoming');
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.delete("/api/admin/events/:id", authenticateToken, isAdmin, (req, res) => {
    const { id } = req.params;
    try {
      // Ensure id is a number for SQLite primary key matching
      const result = db.prepare("DELETE FROM events WHERE id = ?").run(Number(id));
      if (result.changes > 0) {
        res.json({ success: true });
      } else {
        console.warn(`Attempted to delete non-existent event with ID: ${id}`);
        res.status(404).json({ error: "Event not found" });
      }
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  app.post("/api/register", (req, res) => {
    const data = req.body;
    try {
      const info = db.prepare(`
        INSERT INTO registrations (
          name, dob, address_city, address_country, gender, email, mobile, 
          experience, role, doc_photo, doc_aadhar, doc_pan, doc_birth,
          level_passing, year_passing, coaching_cert, edu_qualification, referee_cert
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        data.name, data.dob, data.address_city, data.address_country, data.gender, data.email, data.mobile,
        data.experience, data.role, data.doc_photo, data.doc_aadhar, data.doc_pan, data.doc_birth,
        data.level_passing, data.year_passing, data.coaching_cert, data.edu_qualification, data.referee_cert
      );
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.get("/api/registrations/me", authenticateToken, (req: any, res) => {
    const reg = db.prepare("SELECT * FROM registrations WHERE email = ?").get(req.user.email);
    res.json(reg || null);
  });

  // Admin Routes
  app.get("/api/admin/registrations", authenticateToken, isAdmin, (req, res) => {
    const regs = db.prepare("SELECT * FROM registrations ORDER BY created_at DESC").all();
    res.json(regs);
  });

  app.put("/api/admin/registrations/:id/status", authenticateToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      if (status === 'Approved') {
        const reg = db.prepare("SELECT * FROM registrations WHERE id = ?").get(id) as any;
        if (reg && !reg.unique_id) {
          const unique_id = generateUniqueID(reg.role);
          db.prepare("UPDATE registrations SET status = ?, unique_id = ? WHERE id = ?").run(status, unique_id, id);
        } else {
          db.prepare("UPDATE registrations SET status = ? WHERE id = ?").run(status, id);
        }
      } else {
        db.prepare("UPDATE registrations SET status = ? WHERE id = ?").run(status, id);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.get("/api/admin/stats", authenticateToken, isAdmin, (req, res) => {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const totalRegs = db.prepare("SELECT COUNT(*) as count FROM registrations").get() as any;
    const pendingRegs = db.prepare("SELECT COUNT(*) as count FROM registrations WHERE status = 'Pending'").get() as any;
    res.json({
      users: totalUsers.count,
      registrations: totalRegs.count,
      pending: pendingRegs.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
