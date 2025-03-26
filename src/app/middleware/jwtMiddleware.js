const { access } = require("fs-extra");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../../configuration/jwtConfig");

const verifyToken = (token, type = "access") => {
  try {
    const secret =
      type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error(error.message);
  }
};

const authenticatetionToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      return res.status(401).json({ error: "Unauthorized: Missing token!" });
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "bearer" || !token)
      return res.status(401).json({ error: "Unauthorized: Token is invalid" });
    const tokenFormat = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;
    if (!tokenFormat.test(token)) {
      return res.status(401).json({ message: "Unauthorized: Malformed token" });
    }
    const decoded = verifyToken(token, "access");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorize" });
  }
};

const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorize" });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authenticatetionToken,
  authorizeRole,
};
