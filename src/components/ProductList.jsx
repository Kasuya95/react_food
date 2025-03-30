import React from "react";
import chikbbq from "src/assets/BBQ/food/chikbbq.jpg";
import spicy from "src/assets/BBQ/food/spicy.jpg";
import pig from "src/assets/BBQ/food/pig.jpg";
import pig2 from "src/assets/BBQ/food/pig2.jpg";
import chick from "src/assets/BBQ/food/chick.jpg";
import rice from "src/assets/BBQ/food/rice.jpg";

const products = [
  { id: 1, name: "บาบีคิวไก่", price: 10, img: chikbbq },
  { id: 2, name: "บาบีคิวไก่ซอสเกาหลี", price: 10, img: spicy },
  { id: 3, name: "บาบีคิวหมู", price: 10, img: pig },
  { id: 4, name: "บาบีคิวหมูซอสเกาหลี", price: 10, img: pig2 },
  { id: 5, name: "เนื้อไก่ย่าง", price: 10, img: chick },
  { id: 6, name: "ข้าวเหนียวขาว", price: 10, img: rice }
];

const ProductList = ({ addToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="card bg-white p-4 shadow-md">
          <img src={product.img} alt={product.name} className="w-full h-32 object-cover mb-2" />
          <h5 className="text-lg font-bold">{product.name}</h5>
          <p className="text-gray-600">฿{product.price}</p>
          <button className="btn btn-primary mt-2" onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
