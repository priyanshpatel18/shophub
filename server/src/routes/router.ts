import { Router } from "express";
import * as controller from "../contollers/controller";

const userRouter = Router();
const authRouter = Router();
const vendorRouter = Router();
const customerRouter = Router();
const paymentRouter = Router();
const orderRouter = Router();
const productRouter = Router();
const cartRouter = Router();
const addressRouter = Router();

authRouter
  .post("/sign-up", controller.signUp)
  .post("/sign-in", controller.signIn)
  .get("/sign-out")

userRouter
  .get("/", controller.getUser)
  .get("/profile")

vendorRouter
  .post("/register-business");

customerRouter
  .get("/product/:productId")
  .get("/get-products")

productRouter
  .post("/add-product")
  .get("/view-products")
  .put("/update-product")
  .delete("/delete-product");

paymentRouter
  .post("/add-payment-gateway")
  .put("/update-payment-gateway")
  .delete("/delete-payment-gateway")
  .get("/logs")
  .post("/pay-order")
  .post("/refund-order")


orderRouter
  .get("/view-orders")
  .post("/dispatch-order")
  .post("/update-order-status")
  .post("/place-order")
  .get("/track/:orderId")
  .delete("/cancel/:orderId")

cartRouter
  .post("/add-to-cart")
  .put("/update-cart")

addressRouter
  .post("/add-address")
  .put("/update-address")
  .delete("/delete-address")

export {
  userRouter,
  authRouter,
  vendorRouter,
  customerRouter,
  paymentRouter,
  orderRouter,
  productRouter,
  cartRouter,
  addressRouter
};