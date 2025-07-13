const Product = require("../models/Product");

const addProductReview = async (req, res) => {
  const { rating, comment, image } = req.body;
  const productId = req.params.id;

  try {
    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent duplicate review by same user
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment: comment.trim(),
      image: image || null, // ✅ this is a Cloudinary URL
      createdAt: new Date(),
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { addProductReview };
