import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import cartIcon from "../assets/cart-icon.png"; // import the cart image
import accountIcon from "../assets/account-icon.png"; // import the account image

const Navbar = ({ onSearch }) => {

    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log("Stored user from localStorage:", storedUser);
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data from localStorage
        setUser(null); // Reset the user state
        alert("Logged out successfully!");
        navigate("/customer"); // Redirect to home page
    };
    
    const handleSearchChange = (e) => {
        if (onSearch) {
            onSearch(e.target.value); // Update the search query
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible); // Toggle the dropdown visibility
    };


    return (
        <nav className="navbar">
        <div className="navbar-container">
            <Link to="/customer" className="nav-link">Home</Link>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search products..."
                onChange={handleSearchChange}
                style={{
                    padding: "5px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "1000px",
                }}
            />

            <Link to="/cart" className="nav-link">
                <img src={cartIcon} alt="Cart" className="cart-icon" />
            </Link>

            <div className="account-section">
                {/* Display Welcome message if user is logged in */}
                {user ? (
                    <p className= "username">Welcome, {user.username}</p>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/signup" className="nav-link">Sign Up</Link>
                    </>
                )}
                <div className="account-dropdown">
                    <img
                        src={accountIcon}
                        alt="Account"
                        className="account-icon"
                        onClick={toggleDropdown}
                    />
                    <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
                        {user && <button onClick={handleLogout} className="dropdown-item">Logout</button>}
                    </div>
                </div>
            </div>
        </div>
    </nav>
    );
};

export default Navbar;
