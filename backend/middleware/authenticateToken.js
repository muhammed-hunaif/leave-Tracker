const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {

  const SECRET_KEY = process.env.SECRET_KEY;

  if (!SECRET_KEY) {
    return res.status(500).json({ message: "Server configuration error" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

