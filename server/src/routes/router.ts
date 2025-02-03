import { Router } from "express";
import * as controller from "../contollers/controller";
import { authUser } from "../middlewares/authUser";

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
  .post("/sign-out", controller.signOut)

userRouter
  .get("/", controller.getUser)
  .get("/profile")

vendorRouter
  .post("/register-business");

customerRouter
  .get("/product/:productId")
  .get("/get-products", controller.getProducts);

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
  .get("/get-cart", authUser, controller.getCart)
  .post("/add-to-cart", authUser, controller.addToCart)
  .put("/update-cart", authUser, controller.updateCart)

addressRouter
  .post("/add-address")
  .put("/update-address")
  .delete("/delete-address")

export {
  addressRouter, authRouter, cartRouter, customerRouter, orderRouter, paymentRouter, productRouter, userRouter, vendorRouter
};
