import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import accountIcon from "../assets/account-icon.png";
import "./adminnavbar.css"; // Import the CSS file for Navbar styling


const AdminNavbar = () => {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data from localStorage
        setUser(null); // Reset user state
        alert("Logged out successfully!");
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible); // Toggle the dropdown visibility
    };

    return (
        <div>
        <nav className="admin-navbar">
            <ul>
                <li className="account-dropdown">
                    <img
                        src={accountIcon}
                        alt="Account"
                        className="account-icon"
                        onClick={toggleDropdown} // Toggle dropdown on icon click
                    />
                    <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
                        {user ? (
                            <>
                                <p>Welcome, {user.username}</p>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/adminlogin" className="dropdown-item">Login</Link>
                            </>
                        )}
                    </div>
                </li>
                <li><Link to="/admin">Home</Link></li>
                <li><Link to="/all-orders">All Orders</Link></li>
                <li><Link to="/all-payments">All Payments</Link></li>
            </ul>
        </nav>
        </div>
    );
};

export default AdminNavbar;
