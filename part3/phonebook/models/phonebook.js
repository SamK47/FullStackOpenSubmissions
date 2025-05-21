const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url).then(console.log("Successfully connected to mongoDB!")).catch(err => {
    console.log(err.message);
})

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})


module.exports = mongoose.model('Person', phonebookSchema)