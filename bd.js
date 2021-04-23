const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')

// mongodb://localhost:27017/p1w3d3

function dbConnect() {
  const options = {
    useNewUrlParser: true, // говорим mongoose, что строка подключения будет в новом формате (новый формат должен обязательно содеражт порт)
    useFindAndModify: false, // заставляем методы findOneAndUpdate() и findOneAndRemove() использовать нативный (т.е предоставленный самой mongodb) метод findOneAndUpdate() вместо findAndModify()
    useCreateIndex: true, // Заставляем mongoose работать с функцией createIndex() драйвера mongodb вместо ensureIndex(). Так как последний помечен драйвером mongodb, как устаревший
    useUnifiedTopology: true, // заставляем mongoose использование новый механизм управления подключением драйвера mongodb.
    poolSize: 10, // максимальное количество сокетов, которые драйвер MongoDB будет держать открытыми для этого соединения
    bufferMaxEntries: 0, // говорим mongoose перестать выполнять любые операции с базой данных, после того как произодет отключение от последней.
    // В противном случае mongoose пытается дождаться восстановления соездинения, для завершения  операций
  }

  const DB_HOST = 'localhost'
  const DB_NAME = 'BOT'
  const DB_PORT = 27017

  const dbConnectionURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
  mongoose.connect(dbConnectionURL, options, (err) => {
    if (err) return console.log(err)
    console.log('Success connected to mongo')
  })
}
dbConnect()
const userSchema = new Schema({
  idUser: String,
  idRec: String,
});
const userModel = model('User', userSchema);

module.exports = userModel
