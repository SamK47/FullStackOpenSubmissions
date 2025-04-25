const NumbersList = ({ persons, search, remove, setPersons }) => {
    const removeNumbersList = (person) => {
      if (window.confirm(`Delete ${person.name}`)) {
        remove(person.id).then(() => {
          setPersons(persons.filter(p => p.id !== person.id));
        });
      }
    };

    const filteredPersons = persons.filter(person =>
      person.name.toLowerCase().includes(search.toLowerCase())
    );

    const numbersList = filteredPersons.map(person => (
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => removeNumbersList(person)}>delete</button>
      </div>
    ));

    return <div>{numbersList}</div>;
  };

  export default NumbersList;