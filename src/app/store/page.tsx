"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Phone, MapPin, Clock } from "lucide-react";

export default function StorefrontPage() {
  const products = useQuery(api.customerOrders.getPublicProducts) || [];
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const categories = ["all", ...new Set(products.map((p: any) => p.category))];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p: any) => p.category === selectedCategory);

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0,
  );
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-50 to-white'>
      {/* Header */}
      <header className='bg-white shadow-md sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>Z</span>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-pink-600'>
                  Zara's Delight Bakery
                </h1>
                <p className='text-sm text-gray-600'>
                  Fresh baked goods delivered to you
                </p>
              </div>
            </div>

            <Link
              href='/store/cart'
              className='relative bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2'>
              <ShoppingCart size={20} />
              <span className='font-semibold'>Cart</span>
              {cartItemsCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-yellow-400 text-pink-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold'>
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='bg-gradient-to-r from-pink-500 to-pink-600 text-white py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-4xl md:text-5xl font-bold mb-4'>
            Welcome to Zara's Delight! 🍰
          </h2>
          <p className='text-xl mb-8 text-pink-100'>
            Freshly baked cakes, pastries, and bread delivered to your doorstep
          </p>
          <div className='flex flex-wrap justify-center gap-6 text-sm'>
            <div className='flex items-center gap-2'>
              <Phone size={18} />
              <span>+234 XXX XXX XXXX</span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin size={18} />
              <span>Aba, Abia State</span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock size={18} />
              <span>Mon-Sat: 7AM - 7PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className='container mx-auto px-4 py-8'>
        <div className='flex flex-wrap gap-3 justify-center'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-pink-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-pink-100 border border-pink-200"
              }`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className='container mx-auto px-4 pb-16'>
        <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          Our Products
        </h2>

        {filteredProducts.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-600 text-xl'>No products available yet</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredProducts.map((product: any) => (
              <div
                key={product._id}
                className='bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden'>
                {/* Product Image Placeholder */}
                <div className='h-48 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center'>
                  <span className='text-6xl'>🍰</span>
                </div>

                {/* Product Info */}
                <div className='p-4'>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    {product.productName}
                  </h3>
                  <p className='text-sm text-gray-600 mb-1 capitalize'>
                    {product.category}
                  </p>
                  <p className='text-2xl font-bold text-pink-600 mb-4'>
                    ₦{product.basePrice.toLocaleString()}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className='w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2'>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart Preview (Fixed Bottom) */}
      {cart.length > 0 && (
        <div className='fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-4 border-pink-600 p-4 z-50'>
          <div className='container mx-auto flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Cart Total</p>
              <p className='text-2xl font-bold text-pink-600'>
                ₦{cartTotal.toLocaleString()}
              </p>
              <p className='text-xs text-gray-500'>
                {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href='/store/checkout'
              className='bg-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-pink-700 transition-colors'>
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12 mt-20'>
        <div className='container mx-auto px-4 text-center'>
          <h3 className='text-2xl font-bold mb-4'>Zara's Delight Bakery</h3>
          <p className='text-gray-400 mb-4'>
            Fresh baked goods made with love ❤️
          </p>
          <p className='text-sm text-gray-500'>
            © 2026 Zara's Delight Bakery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
