const AddtoCart = require("../models/Card");

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, item } = req.body;
    let cart = await AddtoCart.findOne({ userId });

    if (!cart) {
      cart = new AddtoCart({ userId, items: [item] });
    } else {
      const existingItem = cart.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push(item);
      }
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user cart
exports.getUserCart = async (req, res) => {
  try {
    const { userId } = req.params; 
    const cart = await AddtoCart.findOne({ userId });


    if (!cart) {
      return res.status(404).json({
        items: [],
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      items: cart.items,
    });
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete item from cart
exports.deleteCartItem = async (req, res) => {
  try {
    const { userId, itemId } = req.query; 

    let cart = await AddtoCart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.id !== itemId);
    await cart.save();

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
  try {
    const { userId, itemId, change } = req.body;
    const cart = await AddtoCart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = Math.max(item.quantity + change, 1);
    await cart.save();

    res.status(200).json({ message: "Quantity updated successfully", items: cart.items });
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

