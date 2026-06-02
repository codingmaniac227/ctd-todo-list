export default function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
    return (
        <>
            <label htmlFor='sortBy'>Sort By</label>
            <select
                id='sortBy'
                value={sortBy}
                onChange={onSortByChange}
            >
                <option value='creationDate'>Creation Date</option>
                <option value='title'>Title</option>
            </select>
            <label htmlFor='sortDirection'>Sort Direction</label>
            <select
                id='sortDirection'
                value={sortDirection}
                onChange={onSortDirectionChange}
            >
                <option value='desc'>Descending</option>
                <option value='asc'>Ascending</option>
            </select>
        </>
    )
}