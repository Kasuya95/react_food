import React from "react";


const products = [
  { id: 1, name: "บาบีคิวไก่", price: 10, img: "src/assets/BBQ/food/chikbbq.jpg" },
  { id: 2, name: "บาบีคิวไก่ซอสเกาหลี", price: 10, img: "src/assets/BBQ/food/spicy.jpg" },
  { id: 3, name: "บาบีคิวหมู", price: 10, img: "src/assets/BBQ/food/pig.jpg" },
  { id: 4, name: "บาบีคิวหมูซอสเกาหลี", price: 10, img: "src/assets/BBQ/food/pig2.jpg" },
  { id: 5, name: "เนื้อไก่ย่าง", price: 10, img: "src/assets/BBQ/food/chick.jpg" },
  { id: 6, name: "ข้าวเหนียวขาว", price: 10, img: "src/assets/BBQ/food/rice.jpg" }
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
