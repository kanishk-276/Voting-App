const jwt = require("jsonwebtoken");

const jAuthmiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid Token' });
  }


  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); 
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid Token' });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
};



module.exports = { jAuthmiddleware, generateToken };
