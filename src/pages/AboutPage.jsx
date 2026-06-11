export default function AboutPage() {
    return (
        <>
            <main>
                <h1>About This Todo App</h1>

                <section>
                    <h2>Overview</h2>
                    <p>This Todo app helps users organize and track their tasks as well as progress towards them while maintaining a user-friendly interface</p>
                </section>

                <section>
                    <h2>Features</h2>
                    <ul>
                        <li>Establish new todos</li>
                        <li>Edit todos</li>
                        <li>Mark todos as complete</li>
                        <li>Filter and search todos</li>
                        <li>User-authenticated routes</li>
                        <li>Persisted data through a backend API(more on that in Node class)</li>
                    </ul>
                </section>

                <section>
                    <h2>Technologies Utilized</h2>
                    <ul>
                        <li>Vite</li>
                        <li>React</li>
                        <li>React Router</li>
                        <li>REST API</li>
                    </ul>
                </section>
            </main>
        </>

    )
}