import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";
import styles from './Navigation.module.css'

export default function Navigation() {
    const { isAuthenticated } = useAuth();

    function getLinkClass({ isActive }) {
        return isActive ? `${styles.link} ${styles.active}` : styles.link;
    }

    return (
        <nav className={styles.nav}>
            <ul className={styles.list}>
                <li>
                    <NavLink to="/about" className={getLinkClass}>
                        About
                    </NavLink>
                </li>

                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="/todos" className={getLinkClass}>
                                Todos
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/profile" className={getLinkClass}>
                                Profile
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink to="/login" className={getLinkClass}>
                            Login
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}