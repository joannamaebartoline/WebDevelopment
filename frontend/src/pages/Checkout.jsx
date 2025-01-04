import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../pages/Navbar";
import "./checkoutstyle.css";
import axios from "axios";

const CheckoutPage = () => {
    const { state } = useLocation();
    const { checkoutItems, totalAmount } = state || {};
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("user");

    const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
    const [showCardForm, setShowCardForm] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        expirationDate: "",
        cvv: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isLoggedIn) {
            alert("Please log in to proceed with checkout.");
            navigate("/login");
            return;
        }
    }, [isLoggedIn, navigate]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        setShowCardForm(e.target.value === "credit-debit-card");
    };

    const handlePaymentDetailsChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handlePlaceOrder = async () => {
        const userData = JSON.parse(localStorage.getItem("user"));
        const orderData = {
            userID: userData.user.id, // Ensure only the user ID is sent
            userName: userData.user.username,
            checkoutItems,
            totalAmount,
            paymentMethod,
            status: "Pending"
        };
    
        try {
            await axios.post("http://localhost:8800/orders", orderData);
            alert("Your order has been placed successfully!");
            window.location.href = "/customer";
            
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };
    

    return (
        <div>
            <Navbar />
            <div className="checkout-container">
                <h1 className="checkout-title">Checkout</h1>

                <div className="cart-items">
                    <h2>Your Cart</h2>
                    <table className="checkout-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkoutItems.map((item) => (
                                <tr key={item.productID}>
                                    <td>{item.title}</td>
                                    <td>₱{item.price.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="total-amount">
                        <h3>Total: ₱{totalAmount.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="payment-method">
                    <h2>Payment Method</h2>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="cash-on-delivery"
                                checked={paymentMethod === "cash-on-delivery"}
                                onChange={handlePaymentMethodChange}
                            />
                            Cash on Delivery
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="payment-center"
                                checked={paymentMethod === "payment-center"}
                                onChange={handlePaymentMethodChange}
                            />
                            Payment Center/E-Wallet (GCash, Maya)
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="credit-debit-card"
                                checked={paymentMethod === "credit-debit-card"}
                                onChange={handlePaymentMethodChange}
                            />
                            Credit/Debit Card
                        </label>
                    </div>

                    {showCardForm && (
                        <div className="credit-card-details">
                            <h3>Add New Credit/Debit Card</h3>
                            <label>
                                Card Number:
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={paymentDetails.cardNumber}
                                    onChange={handlePaymentDetailsChange}
                                    placeholder="XXXX XXXX XXXX XXXX"
                                />
                            </label>
                            <label>
                                Expiration Date:
                                <input
                                    type="text"
                                    name="expirationDate"
                                    value={paymentDetails.expirationDate}
                                    onChange={handlePaymentDetailsChange}
                                    placeholder="MM/YY"
                                />
                            </label>
                            <label>
                                CVV:
                                <input
                                    type="text"
                                    name="cvv"
                                    value={paymentDetails.cvv}
                                    onChange={handlePaymentDetailsChange}
                                    placeholder="XXX"
                                />
                            </label>
                        </div>
                    )}
                </div>

                <div className="optional-message">
                    <h2>Message to Seller (Optional)</h2>
                    <textarea
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Enter your message here..."
                    />
                </div>

                <div className="place-order">
                    <button className="place-order-button" onClick={handlePlaceOrder}>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
