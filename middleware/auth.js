const jwt = require('jsonwebtoken');
const User = require("../models/user");

//this is for verifying the token
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verifyUser);

    const userr = await User.findOne({_id:verifyUser._id})
    console.log(userr);

    req.token = token;
    req.userr = userr;
 
    next();
  } catch (error) {
    res.status(401).send(error);
  }
}

module.exports = auth;