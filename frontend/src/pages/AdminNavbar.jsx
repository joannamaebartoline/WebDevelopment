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

                <li className="dropdown">
                    <Link to="#" className="dropdown-toggle">Categories</Link>
                    <div className="dropdown-menu">
                        <Link to="/category/face" className="dropdown-item">Face Products</Link>
                        <Link to="/category/eye" className="dropdown-item">Eye Products</Link>
                        <Link to="/category/lip" className="dropdown-item">Lip Products</Link>
                        <Link to="/category/nail" className="dropdown-item">Nail Products</Link>
                        <Link to="/category/skincare" className="dropdown-item">Skincare Essentials</Link>
                        <Link to="/category/tools" className="dropdown-item">Tools and Accessories</Link>
                        <Link to="/category/body" className="dropdown-item">Body Products</Link>
                        <Link to="/category/hair" className="dropdown-item">Hair Cosmetics</Link>
                        <Link to="/category/fragrances" className="dropdown-item">Fragrances</Link>
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;
