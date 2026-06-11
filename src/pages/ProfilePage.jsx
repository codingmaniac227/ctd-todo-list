import { useAuth } from "../contexts/AuthContext.jsx";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { email, token, isAuthenticated } = useAuth();

    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        active: 0,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');



    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;

            try {
                setIsLoading(true);
                setError('');

                const res = await fetch('/api/tasks', {
                    method: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.message || 'Failed to fetch todo statistics');
                }

                const tasks = data.tasks || [];

                setStats({
                    total: tasks.length,
                    completed: tasks.filter((task) => task.isCompleted).length,
                    active: tasks.filter((task) => !task.isCompleted).length,
                });
            } catch (err) {
                setError(`Error loading profile statistics: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    const completionPercentage =
        stats.total > 0
            ? Math.round((stats.completed / stats.total) * 100)
            : 0;

    return (
        <>
            <h2>Profile</h2>

            <section>
                <h3>Account Information</h3>
                <p>User: {email}</p>
                <p>Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            </section>

            <section>
                <h3>Todo Statistics</h3>

                {isLoading && <p>Loading todo statistics...</p>}

                {error && <p><strong>{error}</strong></p>}

                {!isLoading && !error && (
                    <>
                        <p>Total Todos: {stats.total}</p>
                        <p>Completed Todos: {stats.completed}</p>
                        <p>Active Todos: {stats.active}</p>

                        {stats.total > 0 ? (
                            <p>Completion: {completionPercentage}%</p>
                        ) : (
                            <p>No todos yet.</p>
                        )}
                    </>
                )}
            </section>
        </>
    );
}