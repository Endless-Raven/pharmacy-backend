const express = require("express");
const app = express();
const cors = require("cors");
const database = require("./config/db");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const categoryRoutes = require("./routes/categories");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const cartItemRoutes = require("./routes/cartItems");

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/category", categoryRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/cartItems", cartItemRoutes);


app.listen(3000, () => {
  console.log("Server listening on port 3000");
});