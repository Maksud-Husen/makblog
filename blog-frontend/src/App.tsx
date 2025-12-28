import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import PostDetails from "./Pages/PostDetails";
import NotFound from "./Pages/NotFound";
import Admin from "./Pages/Admin";
import Login from "./Pages/Login";
import "./App.css";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function App() {  
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isLoginRoute = location.pathname === '/login';
    const isHomeRoute = location.pathname === '/';

    return (
        <div className="app-container">
            <div className={isAdminRoute || isLoginRoute || isHomeRoute ? '' : 'container content-wrap'}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/post/:id" element={<PostDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <Footer />
        </div>
    )
}
export default App