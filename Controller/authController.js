const User = require("../Models/users");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

//Resgistraton
const registerUser = async (req, res) => {
  try {
    const { email, name, password, confirmPassword, phonenumber, address } =
      req.body;
    // checking if user already is existing or not
    const isExisting = await User.findOne({ email });
    if (isExisting) return res.status(400).send("Email is already Registered");
    //checking all fields are filled or not
    if (
      !email ||
      !name ||
      !password ||
      !confirmPassword ||
      !phonenumber ||
      !address
    ) {
      return res.status(400).send("fill all fields");
    }
    //checking password are matched or not.
    if (password !== confirmPassword) {
      return res.status(400).send("Password and Confirm Password dosent match");
    }
    //Hashing password.
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //adding datas to database.

    try {
      const data = await User.create({
        email,
        name,
        imageName: req.file.key,
        password: hashPassword,
        phonenumber,
        address,
      });
      res.status(200).send("Account Created");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred: " + error.message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An fferror occurred: " + error.message });
  }
};

//Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Checking all feilds are available
    if (!email || !password) return res.status(400).send("Fill al the feilds");
    //checking is email is registered or not
    const data = await User.findOne({ email });
    if (!data) return res.status(400).send("Invalid Credentials");
    //comparing passwords
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) return res.status(400).send("Invalid Credentials");
    //generate JWT
    const token = JWT.sign({ email: data.email }, JWT_KEY, {
      expiresIn: "2hr",
    });
    if (!token) return res.status(200).send("Token not generated");

    const fEmail = data.email;

    res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .json({ message: "login Successfull", email: data.email });
  } catch (error) {
    console.log(error);
  }
};

//logout user

const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, expires: new Date(0) });
    res.status(200).send("Logout Successfull");
    console.log("logoutuser");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred: " + error.message });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logout,
};
