import React from 'react';
import { Link } from 'react-router-dom';

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

        return (
          <Link key={product._id} to={`/products/${product._id}`} className="block">
            <div className="bg-white p-3 rounded-lg shadow hover:shadow-md transition">
              <div className="w-full aspect-[3/4] mb-3">
                <img
                  src={getFirstImage(product.images)}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-base font-medium truncate">{product.name}</h3>

              <div className="mt-1">
                {hasDiscount ? (
                  <>
                    <p className="text-sm line-through text-gray-500">
                      ₹{product.price}
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      ₹{product.discountPrice}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-semibold text-black">
                    ₹{product.price}
                  </p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
