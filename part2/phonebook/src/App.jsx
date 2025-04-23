import { useState, useEffect } from 'react'
import NumbersList from './components/NumbersList'
import addNumber from './components/AddNumber'
import SearchFilter from './components/SearchFilter'
import NumberForm from './components/NumberForm'
import phonebook from './services/phonebook'
import Notification from './components/Notification'
const App = () => {
  const [persons, setPersons] = useState([
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setNewSearch] = useState('')
  const [message, setNewMessage] = useState(null)
  const [messageType, setNewMessageType] = useState('')
  useEffect(() => {
    phonebook.getAll().then(initialList => {
      setPersons(initialList)
    })

  }, [])


  const handlePersonAdd = (event) => {
    setNewName(event.target.value)
  }
  const handlePersonNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    addNumber({ persons, newName, newNumber, setPersons, setNewName, setNewNumber, create: phonebook.create, update: phonebook.update, setNewMessage, setNewMessageType })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType}></Notification>
      <div>filter show with
        <SearchFilter search={search} handleSearch={handleSearch} />
      </div>
      <h2>add a new</h2>
      <NumberForm handleSubmit={handleSubmit} handlePersonAdd={handlePersonAdd} newName={newName} handlePersonNumber={handlePersonNumber} newNumber={newNumber} />
      <h2>Numbers</h2>
      <NumbersList persons={persons} search={search} remove={phonebook.remove} setPersons={setPersons}></NumbersList>
    </div>
  )
}

export default App