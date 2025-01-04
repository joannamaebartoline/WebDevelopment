import React, { useEffect, useState } from "react";
import axios from "axios";
import "./allordersstyle.css";
import AdminNavbar from "./AdminNavbar";

const AllOrders = () => {
    const [orders, setOrders] = useState([]);

    const formatDate = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())){
            return "Invalid Date";
        }
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:8800/orders");
            setOrders(res.data);
        } catch (err) {
            console.log("Error fetching orders:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        
        <div className="all-orders-container">
            <AdminNavbar />  
            <h1>All Orders</h1>
            <div className="orders-grid">
                {orders.map((order) => (
                    <div className="order-card" key={order.orderID}>
                        <h2>Order ID: {order.orderID}</h2>
                        <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                        <p><strong>User ID:</strong> {order.userID}</p>
                        <p><strong>User Name:</strong> {order.userName}</p>
                        <p><strong>User Address:</strong> {order.userAddress}</p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                        <p><strong>Status:</strong> {order.status}</p>

                        {/* Display ordered products */}
                        <h3>Ordered Products:</h3>
                        <ul>
                            {order.checkoutItems.map((item) => (
                                <li key={item.productID}>
                                    <p>{item.title}</p>
                                    <p>₱{item.price.toFixed(2)}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Subtotal: ₱{(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                                
                            ))}
                        </ul>
                        <p><strong>Order Total Amount:</strong> ₱{order.totalAmount.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllOrders;
