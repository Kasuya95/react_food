import React, { useState } from "react";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import "./App.css";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

const App = () => {
  const [cart, setCart] = useState([]);

  // เพิ่มสินค้าเข้าในตะกร้า
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
 
  return (
    <div className="min-h-screen bg-gray-100">
      <Header cart={cart} removeFromCart={removeFromCart} />
      <Hero />
      <div className="container mx-auto p-4">
        <ProductList addToCart={addToCart} />
      </div>
      <Footer />
    </div>
  );
};

export default App;
