const db = require('../db/index')

const transfer = async (req, user_id) => {
  const users = await db.getData("/users")
  const accounts = await db.getData("/accounts")
  const target_user = new Array(...users).find(item => item.account === req.body.account)
  const account = new Array(...accounts).find(item => item.user_id === user_id)
  const current_amount = account.deposit
  const transfer_amount = Number(req.body.amount)

  // 驗證帳戶
  if(target_user === undefined || target_user.id === user_id) return { status: 400, code: 2 }

  // 驗證金額格式
  if(!Number.isInteger(transfer_amount) || transfer_amount <= 0) return { status: 400, code: 3 }

  // 驗證金額
  if(transfer_amount > current_amount) return { status: 400, code: 4 }


  // 持久化

  // 1. 新增紀錄
  await db.push("/records", [{
    user_id: user_id,
    in_and_out: 'in',
    opposite_id: target_user.id,
    amount: transfer_amount,
    description: req.body.description,
    created_at: new Date().toISOString()
  }], false)

  // 2. 修改帳戶資料
  let new_accounts
  new_accounts = accounts.map(account => {
    const result = account
    // 新增
    if(account.user_id === user_id) result.deposit = result.deposit - transfer_amount
    if(account.user_id === target_user.id) result.deposit = result.deposit + transfer_amount

    return result
  })

  await db.push("/accounts", new_accounts)
  
  return { status: 200 }
}

module.exports = {
  transfer
}