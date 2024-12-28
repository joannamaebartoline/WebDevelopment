import React from "react";
import { Link } from "react-router-dom";
import cartIcon from "../assets/cart-icon.png"; // import the cart image
import accountIcon from "../assets/account-icon.png"; // import the account image

const Navbar = ({ onSearch }) => {
    const handleSearchChange = (e) => {
        if (onSearch) {
            onSearch(e.target.value); // Update the search query
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="nav-link">Home</Link>

                {/* Products link with dropdown */}
                <div className="nav-link products-dropdown">
                    <Link to="#" className="dropdown-button">
                        Products
                    </Link>
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
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search products..."
                    onChange={handleSearchChange}
                    style={{
                        padding: "5px 10px",
                        marginLeft: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />

                <Link to="/cart" className="nav-link">
                    <img src={cartIcon} alt="Cart" className="cart-icon" />
                </Link>

                <Link to="/account" className="nav-link">
                    <img src={accountIcon} alt="Account" className="account-icon" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
