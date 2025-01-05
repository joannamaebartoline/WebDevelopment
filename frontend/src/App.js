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
import AdminLogin from "./pages/AdminLogin";
import Orders from "./pages/Orders";
import './style.css';

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin" element={<Products />} />
                <Route path="/add" element={<Add />} />
                <Route path="/update/:id" element={<Update />} />
                <Route path="/customer" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/product-modal" element={<ProductModal />} />
                <Route path="/all-orders" element={<AllOrders />} />  {/* Route for All Orders */}
                <Route path="/all-payments" element={<AllPayments />} />  {/* Route for All Payments */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/myorders" element={<Orders />} />
                <Route path="/category/:category" component={Products} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
