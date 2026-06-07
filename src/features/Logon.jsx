import { useState } from "react";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function Logon() {
    const { login } = useAuth();

    const [ auth, setAuth ] = useState({
        email: '',
        password: '',
        authError: '',
        isLoggingOn: false
    })

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
            <form onSubmit={handleSubmit}>
                {auth.authError && (
                    <>
                        <p><strong>{auth.authError}</strong></p>
                    </>
                )}
                <label htmlFor="email">email</label>
                <input
                id="email"
                name='email'
                value={auth.email}
                placeholder='Enter your email'
                onChange={(e) => {
                    setAuth(prevAuth => ({
                        ...prevAuth,
                        email: e.target.value
                    }))
                }}
                required
                />
                <label htmlFor="password">password</label>
                <input
                id="password"
                name='password'
                value={auth.password}
                placeholder='Enter your password'
                onChange={(e) => {
                    setAuth(prevAuth => ({
                        ...prevAuth,
                        password: e.target.value
                    }))
                }}
                required
                />

                <button type='submit' disabled={auth.isLoggingOn}>{auth.isLoggingOn ? 'Logging in...' : 'Logon'}</button>
            </form>
        </>
    )
}