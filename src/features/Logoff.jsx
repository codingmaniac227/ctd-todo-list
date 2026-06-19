import { useAuth } from "../contexts/AuthContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import styles from './Todos/Logoff.module.css'

export default function Logoff() {
    const { logout } = useAuth();

    const [error, setError] = useState("");
    const [isLoggingOff, setIsLoggingOff] = useState(false);

    const navigate = useNavigate();

    async function handleLogout(event) {
        event.preventDefault();

        setError("");
        setIsLoggingOff(true);

        const result = await logout();

        if (!result.success) {
            setError(result.error);
        } else {
            navigate("/login");
        }

        setIsLoggingOff(false);
    }

    return (
        <div className={styles.container}>
            {error && (
                <div className={styles.error}>
                    <strong>{error}</strong>
                </div>
            )}

            <form onSubmit={handleLogout}>
                <button
                    className={styles.logoutButton}
                    type="submit"
                    disabled={isLoggingOff}
                >
                    {isLoggingOff ? "Logging Out..." : "Log Out"}
                </button>
            </form>
        </div>
    );
}