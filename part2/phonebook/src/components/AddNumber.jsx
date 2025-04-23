const addNumber = ({ persons, newName, newNumber, setPersons, setNewName, setNewNumber, create, update, setNewMessage, setNewMessageType }) => {
    event.preventDefault()
    console.log("Form submitted")
    const newPerson = {
        name: newName,
        number: newNumber
    }
    let personPresent = false
    for (let index = 0; index < persons.length; index++) {
        if (persons[index].name === newName && (persons[index].number === newNumber)) {
            alert(`${newName} is already added to phonebook`)

            personPresent = true
            break;
        }
        else if (persons[index].name === newName && (persons[index].number !== newNumber)) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                update(persons[index].id, newPerson).then(
                    response => { setPersons(persons.map(person => person.id === response.id ? response : person)); }

                ).catch(() => {
                    setNewMessage(`Information of ${newPerson.name} has already been removed from server`)
                    setNewMessageType('error')
                    setTimeout(() => {
                        setNewMessage(null)
                        setNewMessageType('')
                    }, 5000)
                }
                )
            }
            personPresent = true;
            break;
        }
    }
    if (personPresent == false) {
        create(newPerson)
            .then(response => {
                setPersons(persons.concat(response));
                setNewName('')
                setNewNumber('')
            })
        setNewMessage(`Added ${newPerson.name}`)
        setTimeout(() => {
            setNewMessage(null)
        }, 5000)
    }

}
export default addNumber