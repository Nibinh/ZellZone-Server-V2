const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const server = express();
server.use(express.json());
dotenv.config();
server.use(cookieParser());

const PORT = process.env.PORT;
console.log(PORT);
server.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

const authRoute = require("./Routes/authRoute");
const userRoutes = require("./Routes/userRoutes");

server.use("/auth", authRoute);
server.use("/user", userRoutes);
