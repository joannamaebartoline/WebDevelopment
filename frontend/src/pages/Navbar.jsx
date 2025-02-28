import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import cartIcon from "../assets/cart-icon.png";
import accountIcon from "../assets/account-icon.png"; 
import "./navbarstyle.css";
import logo from "../assets/logo4.png";
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
        const query = e.target.value.toLowerCase();
        if (onSearch) {
            onSearch(query); 
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
        <div className="logo-container">
                    <img
                        src={logo}
                        alt="Logo"
                        className="logo"
                        onClick={() => navigate("/customer")}
                        style={{ cursor: "pointer" }} // Optional: Makes the logo clickable
                    />
                </div>
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


 <button
  className="nav-link"
  onClick={() => navigate("/myorders")}style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
>
  My Orders
</button>
            <div className="searchbar">
                <input
                    type="text"
                    placeholder="Search products..."
                    onChange={handleSearchChange}
                />
            </div>
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
                </div>
            </div>
    </nav>
    );
};

export default Navbar;