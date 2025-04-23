const SearchFilter = ({ search, handleSearch }) => {
    return (
        <div>
            <input onChange={handleSearch}
                value={search} />
        </div>
    )
}

export default SearchFilter