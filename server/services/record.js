const db = require('../db/index')

const getRecord = async (user_id) => {
  let result;
  const records = await db.getData("/records");
  const accounts = await db.getData("/accounts");
  const user_records = new Array(...records).filter(
    (item) => item.user_id === user_id
  );

  result = user_records.map((item) => {
    const result = { ...item };
    result.opposite_user = new Array(...accounts).find(
      (account) => account.user_id === item.opposite_id
    );

    return result;
  });

  return result;
};

module.exports = {
  getRecord
};
