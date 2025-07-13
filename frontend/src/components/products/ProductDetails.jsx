import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FaStar } from 'react-icons/fa';
import { CameraIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductGrid from './productGrid';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import axios from 'axios';
import colorMap from '../../utils/colorMap';

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/api/products/${productFetchId}`);
      setProduct(res.data);
      setReviews(res.data.reviews || []);
    };
    fetchProduct();
  }, [productFetchId]);

  const availableColors = selectedProduct?.skuVariants
    ? [...new Set(selectedProduct.skuVariants.map((v) => v.color.trim()))]
    : [];

  const getFirstImage = (imagesObj, color) => imagesObj?.[color]?.[0] || '';

  useEffect(() => {
    if (selectedProduct?.skuVariants?.length > 0 && selectedProduct?.images) {
      const firstColor = selectedProduct.skuVariants[0].color;
      setSelectedColor(firstColor);
      setMainImage(getFirstImage(selectedProduct.images, firstColor));
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedColor && selectedProduct?.images?.[selectedColor]) {
      setMainImage(selectedProduct.images[selectedColor][0]);
    }
  }, [selectedColor, selectedProduct]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize('');
    setMainImage(getFirstImage(selectedProduct.images, color));
  };

  const handleSizeSelect = (size) => setSelectedSize(size);

  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((q) => q + 1);
    else if (action === 'minus' && quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select both color and size');
      return;
    }

    const matchedVariant = product?.skuVariants?.find(
      (v) =>
        v.size.toLowerCase() === selectedSize.toLowerCase() &&
        v.color.toLowerCase() === selectedColor.toLowerCase()
    );

    if (!matchedVariant) {
      toast.error('Matching SKU not found');
      return;
    }

    setIsAdding(true);
    dispatch(
      addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        sku: matchedVariant.sku,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => toast.success('Product added to cart', { duration: 1000 }))
      .finally(() => setIsAdding(false));
  };

  const handleReviewSubmit = async () => {
  if (!rating || !reviewText) {
    toast.error('Please provide a rating and review text');
    return;
  }

  let imageUrl = null;

  try {
    // Step 1: Upload image if selected
    if (reviewImage) {
      const formData = new FormData();
      formData.append("image", reviewImage);

      const uploadRes = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      imageUrl = uploadRes.data.imageUrl;
    }

    // Step 2: Submit the review with imageUrl
    await axios.post(
      `/api/products/${productFetchId}/reviews`,
      {
        rating,
        comment: reviewText,
        image: imageUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    toast.success("Review submitted");
    setRating(0);
    setReviewText("");
    setReviewImage(null);

    const res = await axios.get(`/api/products/${productFetchId}`);
    setProduct(res.data);
    setReviews(res.data.reviews || []);
  } catch (error) {
    console.error("Review Submit Error:", error);
    toast.error(error?.response?.data?.message || "Failed to submit review");
  }
};


  const handleReviewImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setReviewImage(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  if (loading || !selectedProduct) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const availableSizes = selectedProduct?.skuVariants
    ?.filter((v) => v.color.toLowerCase() === selectedColor.toLowerCase())
    .map((v) => v.size);


  return (
    <div className="p-6 max-w-6xl mx-auto">
      {selectedProduct && (
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 order-2 md:order-1 justify-center md:justify-start md:mr-4">
            {selectedProduct.images?.[selectedColor]?.map((img, i) => (
  <img
    key={i}
    src={img}
    alt={`Thumbnail ${i}`}
    onClick={() => setMainImage(img)}
    className={`w-20 h-20 object-cover rounded-md cursor-pointer border transition duration-200 ${
      mainImage === img ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-300'
    }`}
  />
))}

          </div>

          {/* Main Image */}
          <div className="flex-1 order-1 md:order-2">
            <div className="w-full max-w-[480px] mx-auto rounded-lg overflow-hidden shadow-md border bg-white">
              {mainImage ? (
  <img src={mainImage} alt="Main Product" className="w-full h-full object-cover" />
) : (
  <div className="w-full h-[400px] flex items-center justify-center text-gray-400 text-sm">
    No image available
  </div>
)}

            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="md:ml-10 mt-6 md:mt-0">
          <h1 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h1>
          {selectedProduct.discountPrice ? (
  <div className="flex items-baseline gap-2 mb-4">
    <p className="text-2xl font-semibold text-green-600">
      ₹ {selectedProduct.discountPrice}
    </p>
    <del className="text-lg text-gray-500">₹ {selectedProduct.price}</del>
  </div>
) : (
  <p className="text-2xl font-semibold text-black mb-4">
    ₹ {selectedProduct.price}
  </p>
)}


          <p className="mb-4 text-gray-700 whitespace-pre-line">{selectedProduct.description}</p>


          {/* Color Selection */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Select Color:</p>
            <div className="flex gap-2 mt-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full border ${
                    selectedColor === color ? 'border-black border-4' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorMap[color] || '#ccc' }}

                ></button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {selectedColor && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Select Size:</p>
              <div className="flex gap-2 mt-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-3 py-1 border rounded ${selectedSize === size ? 'bg-black text-white' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700">Quantity:</p>
            <div className="flex gap-3 items-center mt-2">
              <button onClick={() => handleQuantityChange('minus')} className="px-3 py-1 bg-gray-200 rounded">-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange('plus')} className="px-3 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-2 rounded text-white ${
              isAdding ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>

          {/* Product Characteristics */}
          <div className="mt-10 text-gray-700">
            <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
            <table className="w-full text-left text-sm">
              <tbody>
                <tr>
                  <td className="py-1">Brand</td>
                  <td className="py-1">dipdopdrip</td>
                </tr>
                <tr>
                  <td className="py-1">Material</td>
                  <td className="py-1">{selectedProduct.material}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Similar Products */}
      <div className="mt-10 w-full overflow-x-visible">
  <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
  <ProductGrid products={similarProducts} loading={loading} error={error} />
</div>



      {/* Review Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Submit Your Review</h2>
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={24}
              className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Write your review..."
        />
        <div className="flex items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="cursor-pointer p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            title="Upload Image"
          >
            <CameraIcon className="h-6 w-6 text-gray-600" />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleReviewImageChange}
            className="hidden"
          />
          {reviewImage && <span className="text-sm text-gray-600 truncate max-w-xs">{reviewImage.name}</span>}
        </div>
        <div className="flex justify-center mt-4">
          <button onClick={handleReviewSubmit} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Submit Review
          </button>
        </div>
      </div>

      {/* Display Customer Reviews */}
      {reviews.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
          {reviews.map((review, index) => (
            <div key={index} className="border rounded p-4 mb-4">
  <div className="flex justify-between mb-1">
    <div className="font-semibold text-sm text-gray-800">
      {review?.user?.name || 'Anonymous'}
    </div>
    <div className="text-xs text-gray-500">
      {new Date(review?.createdAt).toLocaleDateString()}
    </div>
  </div>

              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={20}
                    className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              {review.image?.trim() && (
                <img src={review.image} alt="Review" className="w-40 h-auto rounded" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
