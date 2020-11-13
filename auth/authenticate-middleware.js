/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./secrets.js');


module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'missing token' });
  }

  jwt.verify(token, jwtSecret, (error, decoded) => {
    if (error) {
      console.log('unwrapped error ->', error);
      return res.status(401).json({ message: 'bad token' });
    }

    console.log('unwrapped token ->', decoded);
    req.decodedJwt = decoded;
    next();
  });};
