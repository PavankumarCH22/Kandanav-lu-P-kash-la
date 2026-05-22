const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const os = require("os");

const PORT = process.env.PORT || 5173;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "kandanavolu-paakashala-local-admin-secret";
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const WRITABLE_DATA_DIR = process.env.VERCEL ? os.tmpdir() : DATA_DIR;
const INQUIRIES_FILE = path.join(WRITABLE_DATA_DIR, "inquiries.json");

const DATA_FILES = {
  menu: path.join(DATA_DIR, "menu.json"),
  packages: path.join(DATA_DIR, "packages.json"),
  servingStyles: path.join(DATA_DIR, "serving-styles.json"),
  functions: path.join(DATA_DIR, "functions.json"),
  testimonials: path.join(DATA_DIR, "testimonials.json")
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function createAdminToken() {
  const payload = {
    role: "admin",
    exp: Date.now() + 12 * 60 * 60 * 1000
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token || !token.includes(".")) return false;

  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", ADMIN_SECRET).update(body).digest("base64url");

  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return payload.role === "admin" && Date.now() < payload.exp;
  } catch (error) {
    return false;
  }
}

function getAdminToken(req, url) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return url.searchParams.get("token") || "";
}

function localNetworkUrls(req) {
  const interfaces = os.networkInterfaces();
  const urls = [`http://localhost:${PORT}`];

  Object.values(interfaces).flat().forEach(info => {
    if (info && info.family === "IPv4" && !info.internal) {
      urls.push(`http://${info.address}:${PORT}`);
    }
  });

  return [...new Set(urls)];
}

function sendCsv(res, filename, rows) {
  res.writeHead(200, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`
  });
  res.end(rows);
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function inquiriesToCsv(inquiries) {
  const columns = [
    "id",
    "name",
    "phone",
    "eventType",
    "functionType",
    "foodPreference",
    "guests",
    "eventDate",
    "location",
    "packageName",
    "message",
    "createdAt"
  ];
  const lines = [
    columns.join(","),
    ...inquiries.map(inquiry => columns.map(column => csvCell(inquiry[column])).join(","))
  ];
  return lines.join("\r\n");
}

async function readJsonFile(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function readInquiries() {
  try {
    return await readJsonFile(INQUIRIES_FILE);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  return JSON.parse(await readBody(req) || "{}");
}

function validateInquiry(payload) {
  const required = ["name", "phone", "eventType", "functionType", "foodPreference", "guests", "eventDate"];
  const missing = required.filter(field => !String(payload[field] || "").trim());

  if (missing.length) {
    return `Missing required fields: ${missing.join(", ")}`;
  }

  const guests = Number(payload.guests);
  if (!Number.isFinite(guests) || guests < 20) {
    return "Guest count must be at least 20.";
  }

  return "";
}

async function saveInquiry(payload) {
  await fs.mkdir(WRITABLE_DATA_DIR, { recursive: true });

  const existing = await readInquiries();

  const inquiry = {
    id: `KP-${Date.now()}`,
    name: String(payload.name).trim(),
    phone: String(payload.phone).trim(),
    eventType: String(payload.eventType).trim(),
    functionType: String(payload.functionType).trim(),
    foodPreference: String(payload.foodPreference).trim(),
    guests: Number(payload.guests),
    eventDate: String(payload.eventDate).trim(),
    location: String(payload.location || "Kurnool").trim(),
    packageName: String(payload.packageName || "Custom").trim(),
    message: String(payload.message || "").trim(),
    createdAt: new Date().toISOString()
  };

  existing.unshift(inquiry);
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(existing, null, 2));
  return inquiry;
}

async function handleApi(req, res, url) {
  const pathname = url.pathname;

  if (req.method === "GET" && pathname === "/api/device-info") {
    return sendJson(res, 200, {
      port: PORT,
      urls: localNetworkUrls(req),
      note: "Use a Wi-Fi/LAN URL on another device connected to the same network."
    });
  }

  if (req.method === "POST" && pathname === "/api/admin/login") {
    try {
      const payload = await readJsonBody(req);

      if (String(payload.password || "") !== ADMIN_PASSWORD) {
        return sendJson(res, 401, { error: "Invalid admin password." });
      }

      return sendJson(res, 200, {
        token: createAdminToken(),
        message: "Admin login successful."
      });
    } catch (error) {
      return sendJson(res, 400, { error: "Please send a valid login request." });
    }
  }

  if (req.method === "GET" && pathname === "/api/inquiries") {
    if (!verifyAdminToken(getAdminToken(req, url))) {
      return sendJson(res, 401, { error: "Admin login required." });
    }

    return sendJson(res, 200, await readInquiries());
  }

  if (req.method === "GET" && pathname === "/api/inquiries.csv") {
    if (!verifyAdminToken(getAdminToken(req, url))) {
      return sendJson(res, 401, { error: "Admin login required." });
    }

    const inquiries = await readInquiries();
    return sendCsv(res, "kandanavolu-paakashala-bookings.csv", inquiriesToCsv(inquiries));
  }

  if (req.method === "GET" && pathname === "/api/menu") {
    return sendJson(res, 200, await readJsonFile(DATA_FILES.menu));
  }

  if (req.method === "GET" && pathname === "/api/packages") {
    return sendJson(res, 200, await readJsonFile(DATA_FILES.packages));
  }

  if (req.method === "GET" && pathname === "/api/serving-styles") {
    return sendJson(res, 200, await readJsonFile(DATA_FILES.servingStyles));
  }

  if (req.method === "GET" && pathname === "/api/functions") {
    return sendJson(res, 200, await readJsonFile(DATA_FILES.functions));
  }

  if (req.method === "GET" && pathname === "/api/testimonials") {
    return sendJson(res, 200, await readJsonFile(DATA_FILES.testimonials));
  }

  if (req.method === "POST" && pathname === "/api/inquiries") {
    let payload;

    try {
      payload = await readJsonBody(req);
    } catch (error) {
      return sendJson(res, 400, { error: "Please send a valid JSON inquiry." });
    }

    const validationError = validateInquiry(payload);

    if (validationError) {
      return sendJson(res, 400, { error: validationError });
    }

    try {
      const inquiry = await saveInquiry(payload);
      return sendJson(res, 201, {
        message: "Inquiry received. We provide 24/7 village food service in Kurnool and our team will call back soon.",
        inquiry
      });
    } catch (error) {
      return sendJson(res, 500, { error: "Inquiry could not be saved. Please call or WhatsApp us directly." });
    }
  }

  return sendJson(res, 404, { error: "API route not found." });
}

async function serveStatic(req, res, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Page not found");
    }

    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/api/")) {
    return handleApi(req, res, url);
  }

  return serveStatic(req, res, decodeURIComponent(url.pathname));
});

if (!process.env.VERCEL) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Kandanavolu Paakashala running at http://localhost:${PORT}`);
  });
}

module.exports = server;
