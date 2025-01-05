import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import cartIcon from "../assets/cart-icon.png";
import accountIcon from "../assets/account-icon.png"; 

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
    
        localStorage.removeItem("user"); 
       
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

    const handleCartClick = () => {
        const isLoggedIn = localStorage.getItem("user");

        if (!isLoggedIn) {
            alert("Please log in to view your cart.");
            navigate("/login"); 
        } else {
            navigate("/cart"); 
        }
    };

    return (
        <nav className="navbar">
        <div className="navbar-container">
        <button 
  className="nav-link" 
  onClick={(e) => {
    e.preventDefault();  
    window.location.replace("/customer");  
  }}
  style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
>
  Home
</button>


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

<div className="cart-icon-container" onClick={handleCartClick}>
                    <img src={cartIcon} alt="Cart" className="cart-icon" />
                </div>


                <div className="account-dropdown">
                    <img
                        src={accountIcon}
                        alt="Account"
                        className="account-icon"
                        onClick={toggleDropdown}
                    />
                     <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
                        {!user ? (
                            <>
                                <Link to="/login" className="nav-link-ls">Login</Link>
                                <Link to="/signup" className="nav-link-ls">Sign Up</Link>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="dropdown-item">Logout</button>
                        )}
                    </div>
                    <Link to="/myorders">My Orders</Link>
                </div>
            </div>
    </nav>
    );
};

export default Navbar;
