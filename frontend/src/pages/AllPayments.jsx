import React, { useEffect, useState } from "react";
import axios from "axios";

const AllPayments = () => {
    const [payments, setPayments] = useState([]);

    const fetchPayments = async () => {
        try {
            const res = await axios.get("http://localhost:8800/payments");
            setPayments(res.data);
        } catch (err) {
            console.log("Error fetching payments:", err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div>
            <h1>All Payments</h1>
            <div className="payments">
                {payments.map((payment) => (
                    <div className="payment" key={payment.paymentID}>
                        <h2>Payment ID: {payment.paymentID}</h2>
                        <p>Order ID: {payment.orderID}</p>
                        <p>Payment Method: {payment.paymentMethod}</p>
                        <p>Amount: ₱{payment.amount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPayments;
