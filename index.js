const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  const pAmount = persons.length

  res.send(`<p>
    Phonebook has info for ${pAmount} people 
    <br> ${new Date()}
    </p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
 
  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'must include name and number'
    })
  }

  if(persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name already taken'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000 + 1)
  }

  persons = persons.concat(person)

  res.json(persons)
})

const PORT = procress.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})