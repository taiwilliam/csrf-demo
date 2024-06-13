const db = require('../db/index')
const initDB = require('../db/main_init.js')

const resetDB = async req => {
  return await db.push("/", initDB)
}

module.exports = {
  resetDB
}