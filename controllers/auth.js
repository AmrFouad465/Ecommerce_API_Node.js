require("dotenv").config({ path: "../config/.env" });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sk = process.env.JWT_SECRET;
const salt_rounds = parseInt(process.env.SALT_ROUNDS);
const {
  checkCredentials,
  insertNewUser,
  userExist,
} = require("../models/user");
const logIn = async (req, res) => {
  const { email, password } = req.body;
  let user = await checkCredentials(email);
  if (!user) {
    return res.status(401).json({ message: "Wrong user or password" });
  }
  let equal = await bcrypt.compare(password, user.password);
  if (equal) {
    let token = jwt.sign({ "user":user }, sk, { expiresIn: "1d" });
    req.session.authorization = token;
    return res.status(200).json({ message: "login Successful!!!!" });
  } else {
    return res.status(401).json({ message: "Wrong user or password" });
  }
};

const signUp = async (req, res) => {
  const { fName, lName, email, password } = req.body;
  const exist = await userExist(email);
  if (exist) {
    return res.status(409).json({ message: "User already exist" });
  }
  let hashed_password = await bcrypt.hash(password, salt_rounds);
  let user = await insertNewUser(fName, lName, email, hashed_password);
  if (!user) {
    return res.status(401).json({ message: "Wrong user or password" });
  }
  let token = jwt.sign({ "user":user }, sk, { expiresIn: "1d" });
  req.session.authorization = token;
  return res.status(200).json({ message: "signup Successful!!!!" });
};
const verifyToken = (token) => {
  try {
    let decoded = jwt.verify(token, sk);
    return decoded["user"];
  } catch (e) {
    return null;
  }
};
const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Successful logout" });
  });
};
module.exports={logIn,signUp,logOut,verifyToken}