const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const server = express();
server.use(
  cors({
    origin: "https://playful-puppy-6359af.netlify.app",
    credentials: true,
  })
);
server.use(express.json());
dotenv.config();
server.use(cookieParser());

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

const authRoute = require("./Routes/authRoute");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoute");
const wishlistRoutes = require("./Routes/wishlistRoute");
const soldProductRoutes = require("./Routes/sellProdRoutes");
const adminRoutes = require("./Routes/adminRoute");

server.use("/auth", authRoute);
server.use("/user", userRoutes);
server.use("/product", productRoutes);
server.use("/wishlist", wishlistRoutes);
server.use("/sold", soldProductRoutes);
server.use("/admin", adminRoutes);
