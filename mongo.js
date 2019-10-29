const mongoose = require('mongoose')
//console.log('input password, name and number in the given order to create a new contact')
//console.log('or just the password to view contacts already in phonebook')

if (process.argv.length < 3) {
  console.log('no password given')
  process.exit(1)
}

const pass = process.argv[2]

const url = `mongodb+srv://DataUser:${pass}@notecluster-igxxf.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')

  Contact.find({}).then(res => {
    res.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
      mongoose.connection.close()
    })
  })
  
} else {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })

  contact.save().then(res => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
    mongoose.connection.close()
  })
}