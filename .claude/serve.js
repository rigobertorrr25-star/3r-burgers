const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 5501;

const MIME = {
  ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8", ".map": "application/json",
};

http.createServer((req, res) => {
  try {
    let rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "");
    if (rel === "") rel = "index.html";
    let target = path.normalize(path.join(ROOT, rel));
    if (!target.startsWith(ROOT)) { res.statusCode = 403; return res.end("403"); }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory())
      target = path.join(target, "index.html");
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      res.statusCode = 404; return res.end("404: " + rel);
    }
    const type = MIME[path.extname(target).toLowerCase()] || "application/octet-stream";
    const size = fs.statSync(target).size;
    res.setHeader("Content-Type", type);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Accept-Ranges", "bytes");

    const range = req.headers.range;
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : size - 1;
      if (isNaN(start) || isNaN(end) || start > end || end >= size) { start = 0; end = size - 1; }
      res.statusCode = 206;
      res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
      res.setHeader("Content-Length", end - start + 1);
      fs.createReadStream(target, { start, end }).pipe(res);
    } else {
      res.setHeader("Content-Length", size);
      fs.createReadStream(target).pipe(res);
    }
  } catch (e) { res.statusCode = 500; res.end("500: " + e.message); }
}).listen(PORT, "127.0.0.1", () => {
  console.log("3R Burgers en http://localhost:" + PORT + "/");
});
