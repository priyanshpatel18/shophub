import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { authUser } from "./middlewares/authUser";
import { authRouter, cartRouter, productRouter, userRouter } from "./routes/router";

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "https://shophub.priyanshpatel.site"],
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", authUser, cartRouter);

// Connection
const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});