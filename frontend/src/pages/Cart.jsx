import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Use useNavigate instead of useHistory
import "./cartstyle.css";
import Navbar from "../pages/Navbar";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();  // Hook to navigate to different pages

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCartItems);
    }, []);

    const updateQuantity = (productID, quantity) => {
        const updatedCart = cartItems.map((item) =>
            item.productID === productID
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
        );
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeFromCart = (productID) => {
        const updatedCart = cartItems.filter((item) => item.productID !== productID);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setSelectedItems(selectedItems.filter((id) => id !== productID)); // Remove from selection
    };

    const calculateSubtotal = (item) => item.price * item.quantity;

    const calculateTotal = () => {
        const selectedCartItems = cartItems.filter((item) =>
            selectedItems.includes(item.productID)
        );
        return selectedCartItems.reduce(
            (acc, item) => acc + calculateSubtotal(item),
            0
        );
    };

    const handleSelectItem = (productID) => {
        if (selectedItems.includes(productID)) {
            setSelectedItems(selectedItems.filter((id) => id !== productID)); // Deselect
        } else {
            setSelectedItems([...selectedItems, productID]); // Select
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]); // Deselect all
        } else {
            setSelectedItems(cartItems.map((item) => item.productID)); // Select all
        }
    };

    const goToShop = () => {
        navigate("/home"); // Redirect to the home or product page
    };

    const handleCheckout = () => {
        // Collect the selected items and total
        const checkoutItems = cartItems.filter((item) =>
            selectedItems.includes(item.productID)
        );
        const totalAmount = calculateTotal();

        // Redirect to the checkout page with the selected items and total amount
        navigate("/checkout", { state: { checkoutItems, totalAmount } });
    };

    return (
        <div>
            {/* Render Navbar */}
            <Navbar />

            <div className="cart-container">
                <h1 className="cart-title">Your Cart</h1>
                {cartItems.length > 0 ? (
                    <>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === cartItems.length}
                                    onChange={handleSelectAll}
                                />
                                Select All
                            </label>
                        </div>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.productID}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.productID)}
                                                onChange={() => handleSelectItem(item.productID)}
                                            />
                                        </td>
                                        <td>
                                            <img
                                                src={`http://localhost:8800${item.images}`}
                                                alt={item.title}
                                            />
                                        </td>
                                        <td>{item.title}</td>
                                        <td>₱{item.price.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="quantity-input"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    updateQuantity(
                                                        item.productID,
                                                        parseInt(e.target.value) || 1
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>₱{calculateSubtotal(item).toFixed(2)}</td>
                                        <td>
                                            <button
                                                className="remove-button"
                                                onClick={() => removeFromCart(item.productID)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <h2>Total: ₱{calculateTotal().toFixed(2)}</h2>
                            <button
                                className="checkout-button"
                                disabled={selectedItems.length === 0}
                                onClick={handleCheckout}
                            >
                                Checkout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="empty-cart-message">
                        <p>Your cart is empty.</p>
                        <button className="shop-now-button" onClick={goToShop}>
                            Shop Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
