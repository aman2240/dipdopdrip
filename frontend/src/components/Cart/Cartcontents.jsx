import React from 'react';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

const Cartcontents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(
      removeFromCart({
        productId,
        guestId,
        userId,
        size,
        color,
      })
    );
  };

  return (
    <div>
      {cart.products.map((product, index) => {
        const imageKey = Object.keys(product.images || {}).find(
          (key) => key.toLowerCase() === product.color.toLowerCase()
        );
        const productImage = imageKey
          ? product.images[imageKey]?.[0]
          : 'https://via.placeholder.com/200';

        const displayPrice =
          typeof product.discountPrice === 'number'
            ? product.discountPrice
            : product.price;

        return (
          <div
            key={index}
            className="flex items-start justify-between py-4 border-b hover:bg-gray-50 px-2 sm:px-0"
          >
            {/* Product Image and Details */}
            <div className="flex items-start">
              <img
                src={productImage}
                alt={product.name}
                className="w-20 h-24 object-cover mr-4 rounded-md shadow-sm"
              />
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Size: {product.size} | Color: {product.color}
                </p>
                <div className="flex items-center mt-3 space-x-3">
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }
                    className="border px-2 py-1 rounded text-sm font-medium hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-sm">{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }
                    className="border px-2 py-1 rounded text-sm font-medium hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price and Delete */}
            <div className="flex flex-col items-end">
              {displayPrice != null ? (
                <p className="text-sm font-semibold text-gray-800">
                  ₹{displayPrice.toLocaleString()}
                </p>
              ) : (
                <p className="text-sm font-semibold text-gray-800">Price not available</p>
              )}

              {typeof product.discountPrice === 'number' &&
                typeof product.price === 'number' &&
                product.discountPrice < product.price && (
                  <p className="text-xs line-through text-gray-400">
                    ₹{product.price.toLocaleString()}
                  </p>
                )}

              <button
                onClick={() =>
                  handleRemoveFromCart(product.productId, product.size, product.color)
                }
                className="mt-3 hover:text-red-700"
              >
                <RiDeleteBin3Line className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cartcontents;
