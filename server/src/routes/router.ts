import { Router } from "express";
import * as controller from "../contollers/controller";

const userRouter = Router();
const productRouter = Router();
const cartRouter = Router();
const authRouter = Router();

authRouter
  .post("/sign-up", controller.signUp)
  .post("/sign-in", controller.signIn)
  
userRouter
  .get("/", controller.getUser);

productRouter
  .get("/", controller.getProducts)
// .post("/create-product",)
// .put("/:productId",)
// .delete("/:productId",)

cartRouter
  .get("/get-cart", controller.getCart)
  .put("/update-cart", controller.updateCart)

export { productRouter, userRouter, cartRouter, authRouter };
