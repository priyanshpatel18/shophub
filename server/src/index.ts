import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { authUser } from "./middlewares/authUser";
import {
  addressRouter,
  authRouter,
  cartRouter,
  customerRouter,
  orderRouter,
  paymentRouter,
  productRouter,
  userRouter,
  vendorRouter
} from "./routes/router";

// App
const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "https://shophub.priyanshpatel.site/"],
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", authUser, userRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/product", productRouter);
app.use("/api/customer", customerRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);

// Connection
const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});