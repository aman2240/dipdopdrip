import React, { useState } from 'react'
import { HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi'
import { HiBars3BottomRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from "react-redux"

const Navbar = () => {
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const {cart} = useSelector((state) => state.cart);
  const {user} = useSelector((state) => state.auth);

  const cartItemCount = cart.products?.reduce((total, product) => total + product.quantity, 0) || 0;
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  }

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };



  return (
    <>
    <nav className="container mx-auto flex items-center justify-between py-4 px-6">
      {/* left-logo */}
      <div className="flex items-center space-x-4 relative right-7">
        <button onClick={toggleNavDrawer} className="md:hidden">
          <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
        </button>
        <Link to="/" className="poppins-font text-black text-2xl font-bold relative right-1">
          dipdopdrip
        </Link>
      </div>

      {/* Center - Navigation links (now centered) */}
  <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
    <Link
      to="/collections/all?gender=Men"
      className="text-gray-700 hover:text-black text-sm font-medium uppercase"
    >
      Men
    </Link>
    <Link
      to="/collections/all?gender=Women"
      className="text-gray-700 hover:text-black text-sm font-medium uppercase"
    >
      Women
    </Link>
    <Link
      to="/collections/all?category=Oversized"
      className="text-gray-700 hover:text-black text-sm font-medium uppercase"
    >
      Oversized
    </Link>
    {/* <Link
      to="/collections/all?category=Crew"
      className="text-gray-700 hover:text-black text-sm font-medium uppercase"
    >
      Crew
    </Link> */}
  </div>
      {/* right - icons */}
      {/* Right icons - Mobile version */}
<div className="flex items-center space-x-2 relative -right-8 min-w-0 flex-shrink-0 sm:hidden">
  {user && user.role === "admin" && (
    <Link to="/admin" className="bg-black px-1.5 py-0.5 rounded text-xs text-white">Admin</Link>
  )}
  <Link to="/profile" className="hover:text-black">
    <HiOutlineUser className="h-5 w-5 text-gray-700" />
  </Link>
  <button onClick={toggleCartDrawer} className="relative hover:text-black">
    <HiOutlineShoppingBag className="h-5 w-5 text-gray-700 cursor-pointer" />
    {cartItemCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-[#ea2e0e] text-white text-[10px] rounded-full px-1.5 py-0.5">
        {cartItemCount}
      </span>
    )}
  </button>

  <div className="w-[120px] min-w-0 flex-shrink">
    <SearchBar />
  </div>
</div>

{/* Right icons - Desktop version */}
<div className="hidden sm:flex items-center space-x-4 relative right-2">
  {user && user.role === "admin" && (
    <Link to="/admin" className="block bg-black px-2 rounded text-sm text-white">Admin</Link>
  )}
  <Link to="/profile" className="hover:text-black">
    <HiOutlineUser className="h-6 w-6 text-gray-700" />
  </Link>
  <button onClick={toggleCartDrawer} className="relative hover:text-black">
    <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 cursor-pointer" />
    {cartItemCount > 0 && (
      <span className="absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5">
        {cartItemCount}
      </span>
    )}
  </button>
  <SearchBar />
</div>


    </nav>
    <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>

    {/* Mobile Navigation  */}
    <div
      className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex justify-end p-4">
        <button onClick={toggleNavDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <div className="p-6 bg-white rounded-2xl w-full max-w-xs">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 text-center">Menu</h2>
  <nav className="space-y-4">
    {[
      { label: 'Men', path: '/collections/all?gender=Men' },
      { label: 'Women', path: '/collections/all?gender=Women' },
      { label: 'Oversized', path: '/collections/all?category=Oversized' },
      { label: 'Crew', path: '/collections/all?category=Oversized' },
    ].map((item) => (
      <Link
        key={item.label}
        to={item.path}
        onClick={toggleNavDrawer}
        className="block bg-gray-100 text-gray-700 px-4 py-3 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 hover:bg-gray-200 transition duration-200 ease-in-out"
      >
        {item.label}
      </Link>
    ))}
  </nav>
</div>

    </div>
    </>
  )
}

export default Navbar