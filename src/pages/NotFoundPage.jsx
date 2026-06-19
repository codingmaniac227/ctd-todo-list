import {useAuth} from "../contexts/AuthContext.jsx";
import {Link} from "react-router";

export default function NotFoundPage() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <main>
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
                {isAuthenticated ? (
                    <>
                        <Link to='/about'>Go To About</Link>
                        <Link to='/todos'>Go To Todos</Link>
                        <Link to='/profile'>Go To Profile</Link>
                    </>
                ) : (
                    <>
                        <Link to='/about'>Go To About</Link>
                        <Link to='/login'>Sign In</Link>
                    </>
                    )}

            </main>
        </>
    )
}