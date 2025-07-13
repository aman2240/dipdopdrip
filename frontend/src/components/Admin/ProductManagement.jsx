import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {

  const dispatch = useDispatch();
  const {products, loading, error } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the Product")) {
      dispatch(deleteProduct(id));
    }
  };

  if(loading) return <p>Loading...</p>
  if(error) return <p>Error: {error}</p>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer">
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                  <td className="p-4">₹ {product.price.toFixed(2)}</td>
                  <td className="p-4 w-72 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
  {product.skuVariants?.length > 0 ? (
    <ul className="space-y-1">
      {product.skuVariants.slice(0, 2).map((variant, idx) => (
        <li key={idx} className="text-sm truncate">
          {variant.sku} ({variant.color}, {variant.size})
        </li>
      ))}
      {product.skuVariants.length > 2 && (
        <li className="text-sm text-gray-400">...+{product.skuVariants.length - 2} more</li>
      )}
    </ul>
  ) : (
    "—"
  )}
</td>


                  <td className="p-4">
                    <Link to={`/admin/products/${product._id}/edit`} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">Edit</Link>
                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No Products Found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManagement;
