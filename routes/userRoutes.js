const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const AddToCartController = require("../controller/AddTocart");

router.post("/signup", userController.Signup);
router.post("/login", userController.Login);

router.post("/cart", AddToCartController.addToCart);
router.get("/cart/:userId", AddToCartController.getUserCart);

router.delete("/cart/delete", AddToCartController.deleteCartItem);

router.put("/cart/update-quantity", AddToCartController.updateQuantity);

router.get("/userdetails/:userId", authMiddleware, userController.UserProfile);


module.exports = router;
