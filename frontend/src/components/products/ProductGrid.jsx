import React from 'react';
import { Link } from 'react-router-dom';
import { getHexColor } from '../../utils/colorMap';

const getFirstImage = (images) => {
  if (!images || typeof images !== 'object') return '';
  const firstColor = Object.keys(images)[0];
  return images[firstColor]?.[0] || '';
};

const ProductGrid = ({ products = [], loading, error }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No such products available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2 sm:px-0">
      {products.map((product) => {
        const hasDiscount =
          product.discountPrice &&
          product.discountPrice < product.price;

        const uniqueColors = [
          ...new Set(product?.skuVariants?.map((v) => v.color?.trim())),
        ];

        return (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="block"
          >
            <div className="bg-white p-3 rounded-lg shadow hover:shadow-md transition">
              {/* Product Image */}
              <div className="w-full aspect-[3/4] mb-3">
                <img
                  src={getFirstImage(product.images)}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Name */}
              <h3 className="text-base font-medium truncate">
                {product.name}
              </h3>

              {/* Price + Color Swatches */}
              <div className="mt-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  {/* Price & Discount */}
                  <div className="flex flex-col gap-1">
                    {hasDiscount ? (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{product.discountPrice}
                          </p>
                          <del className="text-sm text-gray-500">
                            ₹{product.price}
                          </del>
                        </div>
                        <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded w-fit">
                          {Math.round(
                            ((product.price - product.discountPrice) /
                              product.price) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    ) : (
                      <p className="text-lg font-semibold text-black">
                        ₹{product.price}
                      </p>
                    )}
                  </div>

                  {/* Color Swatches */}
                  {uniqueColors.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-1 md:mt-0">
                      {uniqueColors.slice(0, 5).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-sm border border-gray-300"
                          style={{ backgroundColor: getHexColor(color) }}
                          title={color}
                        />
                      ))}
                      {uniqueColors.length > 5 && (
                        <span className="text-[10px] text-gray-500 ml-1">
                          +more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
