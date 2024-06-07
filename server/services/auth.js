const db = require('../db/index')
const { v4: uuidv4 } = require("uuid");

const loginGate = async req => {
  const data = await db.getData("/users")
  return new Array(...data).find(val => val.account === req.body.account && val.password === req.body.password)
}

const sessionGate = async req => {
  const data = await db.getData("/login_session")
  const session = req.cookies.et_session
  return new Array(...data).find(item => item.value === session)
}

const createLoginSession = async user_id => {
  const session = uuidv4()
  await db.push("/login_session", [{
    id: user_id,
    value: session,
    created_at: new Date().toISOString()
  }], false)

  return session
}

module.exports = {
  loginGate,
  sessionGate,
  createLoginSession
}