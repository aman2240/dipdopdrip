import React, { useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const{ orderDetails, loading, error} = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id))
  },[dispatch, id]);

  useEffect(() => {
  if (orderDetails) {
    console.log("Order Details:", orderDetails); // 👈
  }
}, [orderDetails]);

  if (loading) return <p>Loading ...</p>
  if(error) return <p>Error: {error}</p>

  
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mb-30">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      {!orderDetails ? (<p>No Orders Found</p>) : (
        <div className="p-4 sm:p-6 rounded-lg border border-gray-100">
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID: #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>{orderDetails.isPaid ? "Approved" : "Pending"}</span>
              <span className={`${orderDetails.isdelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>{orderDetails.isdelivered ? "delivered" : "Pending Delievery" }</span>
            </div>
          </div>
          {/* Customer, Payment, Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 ">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p >Payment Method: {orderDetails.paymentMethod}</p>
              <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p>Address: {`${orderDetails.shippingAddress.address} , ${orderDetails.shippingAddress.city} , ${orderDetails.shippingAddress.province},  ${orderDetails.shippingAddress.country}`}</p>
            </div>
          </div>
          {/* Product List */}
          {/* Products Section */}
<div className="mb-8">
  <h4 className="text-lg font-semibold mb-4">Products</h4>

  {/* Mobile view: stacked layout */}
  <div className="space-y-4 sm:hidden">
    {orderDetails.orderItems.map((item) => (
      <div key={item.productId} className="flex items-start justify-between border p-3 rounded-md">
        <div className="flex items-start">
          <img
            src={item.image || item.images?.[item.color]?.[0] || "/placeholder.jpg"}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-md mr-4 flex-shrink-0"
          />
          <div>
            <Link
              to={`/product/${item.productId}`}
              className="text-md font-semibold text-blue-500 hover:underline block"
            >
              {item.name}
            </Link>
            <p className="text-sm text-gray-500">{item.color} | {item.size}</p>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
        </div>
        <div className="text-right ml-2">
          <p className="text-sm font-medium text-gray-800 whitespace-nowrap ">
            ₹{item.price * item.quantity}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Desktop view: table layout */}
  <div className="hidden sm:block overflow-x-auto">
    <table className="min-w-full text-gray-600">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4 text-left">Name</th>
          <th className="py-2 px-4 text-left">Unit Price</th>
          <th className="py-2 px-4 text-left">Quantity</th>
          <th className="py-2 px-4 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {orderDetails.orderItems.map((item) => (
          <tr key={item.productId} className="border-b border-gray-300">
            <td className="py-3 px-4">
              <div className="flex items-start">
                <img
                  src={item.image || item.images?.[item.color]?.[0] || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded mr-4 flex-shrink-0"
                />
                <div>
                  <Link
                    to={`/product/${item.productId}`}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500">{item.color} | {item.size}</p>
                </div>
              </div>
            </td>
            <td className="py-3 px-4">₹ {item.price}</td>
            <td className="py-3 px-4">{item.quantity}</td>
            <td className="py-3 px-4 text-right font-bold">₹ {item.price * item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


          {/* Back to Orders Link  */}
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            Back to My Orders
          </Link>
        </div>
      )}
    </div>
  )
}

export default OrderDetailsPage