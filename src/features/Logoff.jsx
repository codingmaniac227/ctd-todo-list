import {useAuth} from "../contexts/AuthContext.jsx";
import {useState} from "react";
import { useNavigate } from "react-router";

export default function Logoff() {
    const { logout } = useAuth()
    const [ error, setError ] = useState('')
    const [ isLoggingOff, setIsLoggingOff ] = useState(false)

    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault()

        setIsLoggingOff(true)

        const result = await logout()

        if (!result.success) {
            setError( result.error )
        } else {
            navigate("/login")
        }

        setIsLoggingOff(false)
    }


    return (
        <>
            <form onSubmit={handleLogout}>
                {error && (
                    <>
                        <p><strong>{error}</strong></p>
                    </>
                )}
                <button type='submit'
                        disabled={isLoggingOff}
                >
                    {isLoggingOff ? 'Logging out...' : 'Log out'}
                </button>
            </form>
        </>
    )
}