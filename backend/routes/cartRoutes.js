const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();


//helper function to get a cart by user id or guest id
const getCart = async (userId, guestId) => {
  if(userId) {
    return await Cart.findOne({ user: userId});
  } else if (guestId) {
    return await Cart.findOne({guestId});
  }
  return null;
}


//@route POST /api/cart
//@desc add a product to the cart for a guest or logged in user
//@access public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;


  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const imagesObj = product.images instanceof Map
      ? Object.fromEntries(product.images)
      : product.images || {};

    const matchedColorKey = Object.keys(imagesObj).find(
      (key) => key.toLowerCase() === color.toLowerCase()
    );

    const selectedImages = matchedColorKey ? imagesObj[matchedColorKey] : [];
    const imagesObject = matchedColorKey ? { [matchedColorKey]: selectedImages } : {};

    const variantSku = product.skuVariants?.find(
      (v) => v.size === size && v.color.toLowerCase() === color.toLowerCase()
    )?.sku || null;

    let cart = await getCart(userId, guestId);
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          images: imagesObject,
          price: product.price,
discountPrice: product.discountPrice ,

          size,
          color,
          sku: variantSku, // ✅ include SKU
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
  (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
  0
);


      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
  user: userId ? userId : undefined,
  guestId: guestId ? guestId : "guest_" + new Date().getTime(),
  products: [
    {
      productId,
      name: product.name,
      images: imagesObject,
      price: product.price,
      discountPrice: product.discountPrice || product.price,
      size,
      color,
      sku: variantSku,
      quantity,
    },
  ],
  totalPrice: (product.discountPrice || product.price) * quantity,
});

        

      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



//@route PUT /api/cart
//@desc update product quantity in crt for a guest or logged in user
//@access public
router.put("/", async (req, res ) => {
  const { productId, quantity, size, color, guestId, userId} = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if(!cart) return res.status(404).json({ message: "cart not found"});

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if(productIndex > -1){
      //update quantity
      if(quantity > 0){
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // remove product if quantity is 0
      }

      cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

      await cart.save();
      return res.status(200).json(cart);

    } else {
      return res.status(404).json({
        message: "Product not found in cart"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error"});
  }
});


//@route DELETE /api/cart
//@desc Remove a Product from the cart
//@access public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId} = req.body;
  try {
    let cart = await getCart(userId, guestId);

    if(!cart) return res.status(404).json({message: "cart not found"    });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId && p.size === size && p.color === color
    );

    if(productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
  (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
  0
);

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({message: "Product not found in cart"});
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Server Error"});
  }
});

//@route GET /api/cart
//@desc Get logged in users or guests cart
//@access public
router.get("/", async (req, res) => {
  const { userId, guestId} = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if(cart) {
      res.json(cart);
    } else{
      res.status(404).json({message: "Cart not found"});

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
    
  }
});

//@route POST /api/cart/merge
//@desc merge guest cart into user cart on login
//@access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId} = req.body;

  try {
    //find the guest cart and user cart
    const guestCart = await Cart.findOne({guestId});
    const userCart = await Cart.findOne({ user: req.user._id});

    if(guestCart){
      if (guestCart.products.length === 0){
        return res.status(400).json({message: "Guest cart is empty"});

      }

      if(userCart){
        //Merge guest cart into user cart
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex((item) => item.productId.toString() === guestItem.productId.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
        );

        if (productIndex > -1){
          //if the items exists in the user cart , update the quantity
          userCart.products[productIndex].quantity += guestItem.quantity;
        } else{
          //otherwise, add the guest item to the cart
          userCart.products.push(guestItem); 
        }
        });

        userCart.totalPrice = userCart.products.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

        await userCart.save();

        // remove the guest cart after merging
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart:", error);
        }
        res.status(200).json(userCart);
      } else{
        //if the user has no existing cart assign the guest cart t the user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();

        res.status(200).json(guestCart)
      }
    } else{
      if(userCart) {
        //guest cart has already been merged , return user cart
        return res.status(200).json(userCart);
      }
      res.status(404).json({message: "Guest cart not found"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
});

// DELETE all carts
router.delete("/clear", protect, admin, async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.status(200).json({ message: "All carts deleted." });
  } catch (err) {
    console.error("Carts delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;