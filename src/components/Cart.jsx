import React from "react";

const Cart = ({ cart, removeFromCart }) => {
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="mt-6 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">🛒 Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b py-2">
                <span>{item.name} x {item.quantity}</span>
                <span>฿{item.price * item.quantity}</span>
                <button className="btn btn-sm btn-error" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right font-bold">Total: ฿{totalPrice}</div>
        </>
      )}
    </div>
  );
};

export default Cart;
