const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorMiddleware= require("./middleware/errorMiddleware")

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);


const userRoutes=require("./routes/userRoutes")
app.use("/api/users",userRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("CommerceX API is running");
});

app.listen(PORT, () => {
    console.log(`CommerceX backend running on port ${PORT}`);
});