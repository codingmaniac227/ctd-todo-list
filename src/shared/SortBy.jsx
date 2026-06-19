import styles from './SortBy.module.css'

export default function SortBy({
                                   sortBy,
                                   sortDirection,
                                   onSortByChange,
                                   onSortDirectionChange,
                               }) {
    return (
        <div className={styles.container}>
            <div className={styles.group}>
                <label
                    className={styles.label}
                    htmlFor="sortBy"
                >
                    Sort By
                </label>

                <select
                    className={styles.select}
                    id="sortBy"
                    value={sortBy}
                    onChange={onSortByChange}
                >
                    <option value="createdAt">Creation Date</option>
                    <option value="title">Title</option>
                </select>
            </div>

            <div className={styles.group}>
                <label
                    className={styles.label}
                    htmlFor="sortDirection"
                >
                    Direction
                </label>

                <select
                    className={styles.select}
                    id="sortDirection"
                    value={sortDirection}
                    onChange={onSortDirectionChange}
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
        </div>
    );
}