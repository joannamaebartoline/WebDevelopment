import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import "./cartstyle.css";
import Navbar from "../pages/Navbar";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();  
    const isLoggedIn = localStorage.getItem("user");
    const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
    const userKey = user ? user.username : null;

    useEffect(() => { 
        if (!isLoggedIn) {
            alert("Please log in to view your cart.");
            navigate("/login");
            return null;
        }

        const fetchCart = () => {
            try {
                const storedCartItems = JSON.parse(localStorage.getItem(`cart_${userKey}`)) || [];
                setCartItems(storedCartItems);
            } catch (err) {
                console.error("Error fetching cart data:", err);
                setCartItems([]); 
            }
        };

      fetchCart();
    }, [user, userKey, isLoggedIn, navigate]);

    const updateQuantity = (productID, quantity) => {
        const updatedCart = cartItems.map((item) =>
            item.productID === productID
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
        );
        setCartItems(updatedCart);
        localStorage.setItem(`cart_${userKey}`, JSON.stringify(updatedCart));
    };

    const removeFromCart = (productID) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            const updatedCart = cartItems.filter((item) => item.productID !== productID);
            setCartItems(updatedCart);
            localStorage.setItem(`cart_${userKey}`, JSON.stringify(updatedCart));
            setSelectedItems(selectedItems.filter((id) => id !== productID)); 
        }
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
            setSelectedItems(selectedItems.filter((id) => id !== productID));
        } else {
            setSelectedItems([...selectedItems, productID]);
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]); 
        } else {
            setSelectedItems(cartItems.map((item) => item.productID)); 
        }
    };

    const goToShop = () => {
        window.location.href = "/customer";
    };

    const handleCheckout = () => {
        const checkoutItems = cartItems.filter((item) =>
            selectedItems.includes(item.productID)
        );
        const totalAmount = calculateTotal();
        navigate("/checkout", { state: { checkoutItems, totalAmount } });
    };

    return (
        <div>
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
