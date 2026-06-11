import { useLocation, useNavigate } from 'react-router'
import {useEffect} from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function RequireAuth({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                replace: true,
                state: { from: location }
            });
        }
    }, [location, isAuthenticated, navigate] );

    return (
        isAuthenticated ? (
            children
            ) : (
                <p>Authenticating...</p>
            )
    )
}