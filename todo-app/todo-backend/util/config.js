const MONGO_URL = process.env.MONGO_URL || undefined
const REDIS_URL = process.env.REDIS_URL || undefined
const PORT = process.env.PORT || undefined

module.exports = {
  MONGO_URL,
  //: 'mongodb://root:example@localhost:3456/database',
  REDIS_URL,
  //: '//localhost:6379',
  PORT: 3001
}