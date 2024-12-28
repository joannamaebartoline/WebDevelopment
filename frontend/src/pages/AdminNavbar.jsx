import React from "react";
import { Link } from "react-router-dom";
import accountIcon from "../assets/account-icon.png";
import "./adminnavbar.css"; // Import the CSS file for Navbar styling

const AdminNavbar = () => {
    return (
        <nav>
            <ul>
                
               <li>
                    <Link to="/account" className="account-icon">
                    <img src={accountIcon} alt="Account" />
                    </Link>
                </li>
                <li><Link to="/all-orders">All Orders</Link></li>
                <li><Link to="/all-payments">All Payments</Link></li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;
