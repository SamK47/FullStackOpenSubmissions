const NumberForm = ({ handleSubmit, handlePersonAdd, newName, handlePersonNumber, newNumber }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                name:
                <input onChange={handlePersonAdd}
                    value={newName}
                />
            </div>
            <div>number:
                <input onChange={handlePersonNumber}
                    value={newNumber} /></div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default NumberForm