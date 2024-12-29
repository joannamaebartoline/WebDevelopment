import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import ProductModal from "./pages/ProductModal";
import AllOrders from "./pages/AllOrders";  // Add this import
import AllPayments from "./pages/AllPayments";  // Add this import
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import './style.css';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Products />} />
                <Route path="/add" element={<Add />} />
                <Route path="/update/:id" element={<Update />} />
                <Route path="/home" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/product-modal" element={<ProductModal />} />
                <Route path="/all-orders" element={<AllOrders />} />  {/* Route for All Orders */}
                <Route path="/all-payments" element={<AllPayments />} />  {/* Route for All Payments */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
