const SENSITIVE_KEYS = ["password", "passwordhash", "token", "authorization", "secret"];

function sanitize(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      clean[key] = "[REDACTED]";
    } else if (typeof val === "object") {
      clean[key] = sanitize(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

export const logger = {
  info: (...args) => {
    console.log(`[${new Date().toISOString()}] [INFO]`, ...args.map(sanitize));
  },
  warn: (...args) => {
    console.warn(`[${new Date().toISOString()}] [WARN]`, ...args.map(sanitize));
  },
  error: (...args) => {
    console.error(`[${new Date().toISOString()}] [ERROR]`, ...args.map(sanitize));
  },
};
