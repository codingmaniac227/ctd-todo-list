import styles from './FilterInput.module.css'


export default function FilterInput({ filterTerm, onFilterChange }) {
    return (
        <>
            <div className={styles.wrapper}>
                <label
                    className={styles.label}
                    htmlFor="filterInput"
                >
                    Search Todos
                </label>

                <input
                    className={styles.input}
                    type="text"
                    id="filterInput"
                    value={filterTerm}
                    onChange={(e) => onFilterChange(e.target.value)}
                    placeholder="Search by title..."
                />
            </div>
        </>
    )
}