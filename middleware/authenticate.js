// JWT authentication middleware

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "WIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hamFyZCIsImlhdC";

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticate;
