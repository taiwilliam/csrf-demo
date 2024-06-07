const db = require('../db/index')

const getUser = async user_id => {
  const data = await db.getData("/accounts")
  return new Array(...data).find(item => item.user_id === user_id)
}

module.exports = {
  getUser
}