// отримує токен
//розшифровує токен
//передає інфо з токена далі
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
module.exports = async (req, res, next) => {
  try {
    const [type, token] = req.headers.authorization.split(" ");

    if (type === "Bearer" && token) {
      const decoded = jwt.verify(token, "cat");
      const user = await UserModel.findById(decoded.id);
      if (user.token !== token) {
        res.status(401);
        throw new Error("Token is not match");
      }
      req.user = decoded;
      next();
    }
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: error.message,
    });
  }
};

// {
//   students: [ 'Kate', 'Dolphin', 'Alex', 'Oleg' ],
//   teacher: 'Andr',
//   id: '656afa32e9e02a596bbdc6f8',
//   iat: 1701511160,
//   exp: 1701539960
// }
