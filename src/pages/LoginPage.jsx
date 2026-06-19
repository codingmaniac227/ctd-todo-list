import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import styles from './Page.module.css'

export default function LoginPage() {
    const { login, isAuthenticated, token } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [ auth, setAuth ] = useState({
        email: '',
        password: '',
        authError: '',
        isLoggingOn: false
    })

    const from = location.state?.from?.pathname || '/todos'

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, from])

    async function handleSubmit(e) {
        e.preventDefault()

        setAuth(prev => ({
            ...prev,
            isLoggingOn: true,
            authError: '',
        }))

        const result = await login(auth.email, auth.password)

        if (!result.success) {
            setAuth( prev => ({
                ...prev,
                authError: result.error
            }))
        }

        setAuth(prev => ({
            ...prev,
            isLoggingOn: false,
        }))
    }

    return (
        <>
            <section className={styles.page}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Login</h2>

                    <p className={styles.subtitle}>
                        Access your personalized todo dashboard.
                    </p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {auth.authError && (
                            <div className={styles.error}>
                                {auth.authError}
                            </div>
                        )}

                        <label htmlFor="email">Email</label>

                        <input
                            className={styles.input}
                            id="email"
                            name="email"
                            value={auth.email}
                            placeholder="Enter your email"
                            onChange={(e) =>
                                setAuth((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            required
                        />

                        <label htmlFor="password">Password</label>

                        <input
                            className={styles.input}
                            type="password"
                            id="password"
                            name="password"
                            value={auth.password}
                            placeholder="Enter your password"
                            onChange={(e) =>
                                setAuth((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                            required
                        />

                        <button
                            className={styles.button}
                            type="submit"
                            disabled={auth.isLoggingOn}
                        >
                            {auth.isLoggingOn ? "Logging In..." : "Login"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    )
}