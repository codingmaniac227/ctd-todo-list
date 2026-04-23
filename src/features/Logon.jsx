import { useState } from "react";

export default function Logon({ onSetEmail, onSetToken }) {
    const [ auth, setAuth ] = useState({
        email: '',
        password: '',
        authError: '',
        isLoggingOn: false
    })


        const handleSubmit = async (e) => {
            try {
                e.preventDefault();
                setAuth(prevAuthState => ({
                    ...prevAuthState,
                    isLoggingOn: true
                }))

                const resp = await fetch('/api/users/logon', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify( {
                        email: auth.email,
                        password: auth.password
                    } )
                })

                const data = await resp.json()
                const { name, csrfToken } = data

                if (resp.status === 200 && data.name && data.csrfToken) {

                    onSetEmail(data.name)
                    onSetToken(data.csrfToken)
                } else {
                    setAuth(prevAuthState => ({
                        ...prevAuthState,
                        authError: `Authentication failed: ${data?.message}`
                    }))
                }
            } catch(err) {
                setAuth(prevAuthState => ({
                    ...prevAuthState,
                    authError: `Error: ${err.name} | ${err.message}`
                }))
            } finally {
                setAuth(prevAuthState => ({
                    ...prevAuthState,
                    isLoggingOn: false
                }))
            }
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