import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"; 
import "./cartstyle.css";
import Navbar from "../pages/Navbar";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();  
    const isLoggedIn = Boolean(localStorage.getItem("user"));

    useEffect(() => {
        if (!isLoggedIn) {
            alert("Please log in to view your cart.");
            navigate("/login");
            return null;
        }
    
        const fetchCart = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const userID = storedUser?.user?.id;
                const res = await axios.get(`http://localhost:8800/cart/${userID}`);
                setCartItems(res.data.cartItems);
                localStorage.setItem(`cart_${userID}`, JSON.stringify(res.data.cartItems));
            } catch (err) {
                console.error("Error fetching cart data:", err);
                setCartItems([]); // In case of error, set an empty cart
            }
        };
    
        fetchCart();
    }, [isLoggedIn, navigate]);
    

    const updateQuantity = async (productID, quantity) => {
        const isLoggedIn = localStorage.getItem("user");
        if (!isLoggedIn) {
            alert("Please log in to update the cart.");
            navigate("/login");
            return;
        }
    
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userID = storedUser?.user?.id;
    
        if (!userID) {
            console.error("User ID is missing from the local storage.");
            alert("Failed to retrieve user information. Please log in again.");
            navigate("/login");
            return;
        }
    
        // Ensure quantity is at least 1
        const updatedQuantity = Math.max(1, quantity);
    
        try {
            // Update quantity in the database via the backend
            await axios.put("http://localhost:8800/cart", {
                userID,
                productID,
                quantity: updatedQuantity,
            });
    
            // Update the local state and localStorage
            const updatedCart = cartItems.map((item) =>
                item.productID === productID
                    ? { ...item, quantity: updatedQuantity }
                    : item
            );
            setCartItems(updatedCart);
            localStorage.setItem(`cart_${userID}`, JSON.stringify(updatedCart));
    
           
        } catch (err) {
            console.error("Error updating cart:", err);
            alert("Failed to update cart. Please try again.");
        }
    };
    

    const removeFromCart = async (productID) => {
        const isLoggedIn = localStorage.getItem("user");
        if (!isLoggedIn) {
            alert("Please log in to remove items from the cart.");
            navigate("/login");
            return;
        }
    
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userID = storedUser?.user?.id;
    
        if (!userID) {
            console.error("User ID is missing from the local storage.");
            alert("Failed to retrieve user information. Please log in again.");
            navigate("/login");
            return;
        }
    
        if (window.confirm("Are you sure you want to remove this item?")) {
            try {
                // Remove item from the database via the backend
                await axios.delete("http://localhost:8800/cart", {
                    data: {
                        userID,
                        productID,
                    },
                });
    
                // Update the local state and localStorage
                const updatedCart = cartItems.filter((item) => item.productID !== productID);
                setCartItems(updatedCart);
                localStorage.setItem(`cart_${userID}`, JSON.stringify(updatedCart));
    
                alert("Product removed from cart!");
            } catch (err) {
                console.error("Error removing product from cart:", err);
                alert("Failed to remove product from cart. Please try again.");
            }
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
                <h1 className="cart-title">Cart</h1>
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