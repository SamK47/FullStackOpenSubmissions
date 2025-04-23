const NumbersList = ({ persons, search, remove, setPersons }) => {

    const removeNumbersList = (personPARAM) => {
        if (window.confirm(`Delete ${personPARAM.name}`)) {
            remove(personPARAM.id).then(response => 
                setPersons(persons.filter(person => person.id !== response.id)))
        }
    }
    const numbersList = persons.map(person => <div key={person.id}>{person.name} {person.number}<button onClick={() => removeNumbersList(person)}>delete</button></div>)
    if (search != 0) {
        const filteredNumbersList = numbersList.filter(person => <li> {person.props.children[0].toLowerCase().includes(search.toLowerCase())} </li>)
        console.log(filteredNumbersList);
        return (
            <div>
                {filteredNumbersList}
            </div>
        )
    }
    else {
        return (
            <div>
                {numbersList}
            </div>
        )
    }
}

export default NumbersList