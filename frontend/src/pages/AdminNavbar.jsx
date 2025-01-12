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
                {/* Replace ul with div */}
                <div className="nav-container">
                    {/* Replace li with div */}
                    
                    <div>
                        <button className="nav-buttonadmin">
                            <Link to="/admin">Home</Link>
                        </button>
                    </div>
                    <div>
                        <button className="nav-buttonadmin">
                            <Link to="/all-orders " style={{ color: "white", textDecoration: "none" }}>All Orders</Link>
                        </button>
                    </div>
                    <div className="account-dropdownadmin">
                        <img
                            src={accountIcon}
                            alt="Account"
                            className="account-iconadmin"
                            onClick={toggleDropdown} // Toggle dropdown on icon click
                        />
                        <div className={`dropdown-menuadmin ${dropdownVisible ? "show" : ""}`}>
                            {user ? (
                                <>
                                    <button onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/adminlogin" className="dropdown-itemadmin  " style={{ color: "white", textDecoration: "none" }}>Login</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default AdminNavbar;