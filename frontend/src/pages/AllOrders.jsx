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

    const handleUpdateStatus = async (orderID, newStatus) => {
        try {
            
            const res = await axios.put(`http://localhost:8800/orders/${orderID}`, { status: newStatus });
            
            fetchOrders();  
            alert(res.data.message);
        } catch (err) {
            console.log("Error updating status:", err);
            alert("Error updating the order status.");
        }
    };

    const groupOrdersByStatus = (orders) => {
        return orders.reduce((groups, order) => {
            const status = order.status;
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(order);
            return groups;
        }, {});
    };

    const groupedOrders = groupOrdersByStatus(orders);

    return (
        <div>
        <AdminNavbar />
        <div className="all-orders-container">
            
            <h1>All Orders</h1>
            {["Pending", "Shipped", "Delivered", "Cancelled", "Received"].map((status) => (
                <div key={status} className="orders-section">
                    <h2>{status} Orders</h2>
                    {groupedOrders[status] && groupedOrders[status].length > 0 ? (
                        <div className="orders-grid">
                            {groupedOrders[status].map((order) => (
                                <div className="order-card" key={order.orderID}>
                                    <h2>Order ID: {order.orderID}</h2>
                                    <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                                    <p><strong>User ID:</strong> {order.userID}</p>
                                    <p><strong>User Name:</strong> {order.userName}</p>
                                    <p><strong>User Address:</strong> {order.userAddress}</p>
                                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                    <p><strong>Status:</strong> {order.status}</p>
                                 
                                    {order.status !== "Received" && (
                                        <select 
                                            onChange={(e) => handleUpdateStatus(order.orderID, e.target.value)} 
                                            value={order.status}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    )}

                                    {/* Display ordered products */}
                                    <h3>Ordered Products:</h3>
                                    <ul>
                                    {order.checkoutItems.map((item) => (
    <li key={item.productID}>
        <p>{item.title}</p>
        <p>₱{(item.price ? item.price.toFixed(2) : "0.00")}</p> {/* Check if price is valid */}
        <p>Quantity: {item.quantity}</p>
        <p>Subtotal: ₱{(item.price * item.quantity ? (item.price * item.quantity).toFixed(2) : "0.00")}</p> {/* Check if price * quantity is valid */}
    </li>
))}

                                    </ul>
                                    <p><strong>Order Total Amount:</strong> ₱{(order.totalAmount ? order.totalAmount.toFixed(2) : "0.00")}</p> {/* Check if totalAmount is valid */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No orders in this status.</p>
                    )}
                </div>
             ))}
        </div>
        </div>
    );
};

export default AllOrders;
