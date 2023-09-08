const User = require("../Models/users");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { email, name, password, confirmPassword, phonenumber, address } =
      req.body;
    //checking if user already is existing or not
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
        password: hashPassword,
        phonenumber,
        address,
      });
      res.status(200).send("Account Created");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  registerUser,
};
