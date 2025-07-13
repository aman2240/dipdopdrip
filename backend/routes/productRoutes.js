const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const { addProductReview } = require("../controller/productController");

const router = express.Router();

// @route POST /api/products
// @desc Create new product with variants
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name, description, price, discountPrice, countInStock, category,
      collections, material, gender, images,
      isFeatured, isPublished, tags, dimensions, weight,
      skuVariants, printTypeId, searchFromMyProducts, designs
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      skuVariants,
      printTypeId,
      searchFromMyProducts,
      designs,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/similar/:id
// @desc Get similar products
// @access Public
router.get("/similar/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const similar = await Product.find({
      _id: { $ne: req.params.id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similar);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/best-seller
// @desc Get a best-selling product (fallback to most recent if rating not available)
// @access Public
// routes/productRoutes.js
router.get("/best-seller", async (req, res) => {
  try {
    const bestProduct = await Product.findOne({}).sort({ rating: -1 }).limit(1);

    if (!bestProduct) {
      return res.status(404).json({ message: "No product found" });
    }

    res.json(bestProduct); // ✅ must return a product here
  } catch (error) {
    console.error("Best Seller Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// @route GET /api/products/new-arrivals
// @desc Get latest 8 products
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const arrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(arrivals);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route PUT /api/products/:id
// @desc Update product
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name, description, price, discountPrice, countInStock, category,
      collections, material, gender, images,
      isFeatured, isPublished, tags, dimensions, weight,
      skuVariants, printTypeId, searchFromMyProducts, designs,rating
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.countInStock = countInStock ?? product.countInStock;
    product.category = category ?? product.category;
    product.collections = collections ?? product.collections;
    product.material = material ?? product.material;
    product.gender = gender ?? product.gender;
    product.images = images ?? product.images;
    product.isFeatured = isFeatured ?? product.isFeatured;
    product.isPublished = isPublished ?? product.isPublished;
    product.tags = tags ?? product.tags;
    product.rating = rating ?? product.rating;

    if (dimensions) {
      product.dimensions.length = dimensions.length ?? product.dimensions.length;
      product.dimensions.width = dimensions.width ?? product.dimensions.width;
      product.dimensions.height = dimensions.height ?? product.dimensions.height;
    }

    product.weight = weight ?? product.weight;
    product.skuVariants = skuVariants ?? product.skuVariants;
    product.printTypeId = printTypeId ?? product.printTypeId;
    product.searchFromMyProducts = searchFromMyProducts ?? product.searchFromMyProducts;
    product.designs = designs ?? product.designs;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route DELETE /api/products/:id
// @desc Delete product
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products
// @desc Get all products with optional filters
// @access Public

// @route GET /api/products
// @desc Get all products with optional filters
// @access Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      gender,
      color,
      size,
      material,
      minPrice,
      maxPrice,
      sort,
      search,
    } = req.query;

    const filter = {
      isPublished: true,
    };

    if (category) filter.category = category;
    if (gender) filter.gender = gender;

    if (material) {
      filter.material = { $in: material.split(',') };
    }

    if (minPrice || maxPrice) {
      filter.$or = [
        {
          discountPrice: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        },
        {
          $and: [
            { discountPrice: { $in: [null, 0] } }, // fallback to price
            {
              price: {
                ...(minPrice && { $gte: Number(minPrice) }),
                ...(maxPrice && { $lte: Number(maxPrice) }),
              },
            },
          ],
        },
      ];
    }

    if (color || size) {
  const variantMatch = {};

  if (color) {
    const colorArray = color.split(',').map((c) => new RegExp(`^${c.trim()}`, 'i'));  // regex
    variantMatch.color = { $in: colorArray };
  }

  if (size) {
    const sizeArray = size.split(',').map((s) => new RegExp(`^${s.trim()}`, 'i'));    // regex
    variantMatch.size = { $in: sizeArray };
  }

  filter.skuVariants = { $elemMatch: variantMatch };
}



    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Prepare sort stage
    let sortStage = {};
    if (sort === 'price-asc') {
      sortStage = { effectivePrice: 1 };
    } else if (sort === 'price-desc') {
      sortStage = { effectivePrice: -1 };
    } else if (sort === 'popularity') {
      sortStage = { rating: -1 };
    }

    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $gt: [{ $ifNull: ["$discountPrice", 0] }, 0] },
              then: "$discountPrice",
              else: "$price",
            },
          },
        },
      },
      ...(Object.keys(sortStage).length > 0 ? [{ $sort: sortStage }] : []),
    ];

    const products = await Product.aggregate(pipeline);
    res.json(products);
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// @route GET /api/products/:id
// @desc Get single product
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route POST /api/products/:id/reviews
// @desc Add product review
// @access Private
router.post("/:id/reviews", protect, addProductReview);

// @route   DELETE /api/products/:productId/reviews/:reviewId
// @desc    Admin can delete any review
// @access  Private/Admin
router.delete("/:productId/reviews/:reviewId", protect, admin, async (req, res) => {
  const { productId, reviewId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove review by ID
    const reviewIndex = product.reviews.findIndex(
      (rev) => rev._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ message: "Server error while deleting review" });
  }
});

module.exports = router;
