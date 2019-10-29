require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('./local_modules/morgan')
const cors = require('cors')

const Contact = require('./models/contact')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (req, res) => {
  res.send('<h1>The app is not showing :(</h1>')
})

app.get('/info', (req, res) => {
  Contact.find({}).then(data => {
    const cAmount = data.length

    res.send(`<p>
      Phonebook has info for ${cAmount} people 
      <br> ${new Date()}
      </p>`)
  })

})

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts.map(contact => contact.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id).then(contact => {
    if (contact) {
      res.json(contact.toJSON())
    } else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'must include name and number'
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save()
    .then(saved => {
      res.json(saved.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const contact = {
    name: req.body.name,
    number: req.body.number
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => {
      res.json(updatedContact.toJSON())
    })
    .catch(error => next(error))
})


const errorUnknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(errorUnknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})