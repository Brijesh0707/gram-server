const jwt = require("jsonwebtoken");
const jwt_secret = require("../jwt");
const mongoose = require("mongoose");
const USER = mongoose.model("USERS");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "You must be logged in" });
  }


  const token = authorization.replace("Bearer ", "");


  jwt.verify(token, jwt_secret, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { _id } = payload;

    try {
      const user = await USER.findById(_id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      // console.log(user);
      req.user = user;


      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred while checking authentication" });
    }
  });
};
