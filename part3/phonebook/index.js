require('dotenv').config()
const Person = require('./models/phonebook')
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'));

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

morgan.token('postBody', (req) => {
    if (req.method === 'POST') {
        const { name, number } = req.body;
        return JSON.stringify({ name, number });
    }
    return '';

});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'));

app.get('/', (request, response) => {
    response.send('<h1>Hello Backend</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})

app.get('/info', (request, response) => {
    const personNumber = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${personNumber} people</p><p>${date}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (!person) {
        return response.status(404).end()
    }
    response.json(person)


})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = request.body;
    if (!newPerson.name || newPerson.name.trim() === '') {
        return response.status(400).json({ error: 'name must be provided and it cannot be empty' });
    }

    if (!newPerson.number || newPerson.number.trim() === '') {
        return response.status(400).json({ error: 'number must be provided and it cannot be empty' });
    }

    Person.findOne({ name: newPerson.name }).then(existingPerson => {
        if (existingPerson) {
            return response.status(400).json({ error: 'name must be unique' });
        }

        const person = new Person({
            name: newPerson.name,
            number: newPerson.number
        });

        person.save().then(savedPerson => {
            response.json(savedPerson);
        });
    }).catch(error => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)