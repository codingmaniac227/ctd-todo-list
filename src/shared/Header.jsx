import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";
import styles from "./Header.module.css";

export default function Header() {
    const { isAuthenticated } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.brandSection}>
                <h1 className={styles.title}>My Tasks</h1>

                <p className={styles.subtitle}>
                    Organize, prioritize, and complete your daily work.
                </p>
            </div>

            <Navigation />

            {isAuthenticated && (
                <div className={styles.actions}>
                    <Logoff />
                </div>
            )}
        </header>
    );
}