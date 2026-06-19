import styles from './Page.module.css'

export default function AboutPage() {
    return (
        <>
            <section className={styles.page}>
                <div className={styles.card}>
                    <h1 className={styles.title}>About This Todo App</h1>

                    <p className={styles.subtitle}>
                        A React-based productivity application designed to help users manage tasks efficiently.
                    </p>
                </div>

                <div className={styles.card}>
                    <h2>Features</h2>

                    <ul>
                        <li>Create new todos</li>
                        <li>Edit existing todos</li>
                        <li>Mark todos as complete</li>
                        <li>Search and filter todos</li>
                        <li>Protected authenticated routes</li>
                        <li>Backend API integration</li>
                    </ul>
                </div>

                <div className={styles.card}>
                    <h2>Technologies</h2>

                    <ul>
                        <li>React</li>
                        <li>React Router</li>
                        <li>Vite</li>
                        <li>REST APIs</li>
                        <li>Context API</li>
                        <li>useReducer</li>
                    </ul>
                </div>
            </section>
        </>

    )
}