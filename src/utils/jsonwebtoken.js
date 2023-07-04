const jwt = require("jsonwebtoken");

const PRIVATE_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h", });
  return token;
};

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return res.status(401).send({ status: "error authToken (jsonwebtoken.js)", message: "No se envió el token (jsonwebtoken.js)" });
  
  const token = authHeader.split(" ")[1];

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(401).send({ status: "error authToken (jsonwebtoken.js)", message: "Token inválido (jsonwebtoken.js)" });
    req.user = credentials.user;
    next();
  });
};

module.exports = {
  generateToken,
  authToken,
};
