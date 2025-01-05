import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../pages/Navbar";
import "./ordersstyle.css"
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const alertShown = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser && !alertShown.current) {
            alert("Please log in to view your orders.");
            alertShown.current = true;
            navigate("/login");
        } else if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser.user);
        }
    }, [navigate]);

    useEffect(() => {
        if (user) {
            axios.get("http://localhost:8800/orders")
                .then((response) => {
                    const userOrders = response.data.filter((order) => order.userID === user.id);
                    setOrders(userOrders);
                })
                .catch((error) => {
                    console.error("Error fetching orders:", error);
                });
        }
    }, [user]);

    const handleOrderReceived = (orderID) => {
        axios.put(`http://localhost:8800/orders/${orderID}`, {
            status: "Received"
        })
        .then((response) => {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.orderID === orderID ? { ...order, status: "Received" } : order
                )
            );
            alert("Order status updated to 'Received'.");
        })
        .catch((error) => {
            console.error("Error updating order status:", error);
        });
    };

    return (
        <div>
            <Navbar />
            <div className="orders-container">
                <h1>Your Orders</h1>
                {orders.length === 0 ? (
                    <p>You have no orders yet.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.orderID} className="order-details">
                            <p><strong>Status:</strong> {order.status}</p>
                            <h3>Items:</h3>
                            <ul>
                                {order.checkoutItems.map((item, index) => (
                                    <li key={index} >
                                        {item.title} - ₱{item.price.toFixed(2)} x {item.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Total Amount:</strong> ₱{order.totalAmount.toFixed(2)}</p>
                            {order.status !== "Received" && order.status !== "Cancelled" &&(
                                <button
                                    className="order-received-button"
                                    onClick={() => handleOrderReceived(order.orderID)}
                                >
                                    Order Received
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;
