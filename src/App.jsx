import './App.css'
import Header from "./shared/Header.jsx";
import TodosPage from "./pages/TodosPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import {Route, Routes} from "react-router";
import styles from './App.module.css'

function App() {

    return (
        <>
            <Header />

            <main className={styles.container}>
                <div className={styles.pageCard}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/todos"
                            element={
                                <RequireAuth>
                                    <TodosPage />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <RequireAuth>
                                    <ProfilePage />
                                </RequireAuth>
                            }
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </main>
        </>
    );
}

export default App
