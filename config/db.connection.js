const mongoose = require('mongoose')
const URI = process.env.DB;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const connection = mongoose.connection;

module.exports = connection;
