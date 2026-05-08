// 添加记录
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { amount, type, category, date, note } = event;
  const { OPENID } = cloud.getWXContext();

  console.log('[addRecord] event:', JSON.stringify(event));
  console.log('[addRecord] OPENID:', OPENID);

  if (!amount || amount <= 0) return { success: false, error: '金额必须大于0' };
  if (!type || !['income', 'expense'].includes(type)) return { success: false, error: '类型无效' };
  if (!category) return { success: false, error: '请选择分类' };
  if (!date) return { success: false, error: '请选择日期' };

  try {
    const record = {
      openid: OPENID,
      amount: Number(amount),
      type,
      category,
      date: new Date(date),
      note: note || '',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    };

    console.log('[addRecord] inserting record:', JSON.stringify(record));
    const res = await db.collection('records').add({ data: record });
    console.log('[addRecord] success, _id:', res._id);
    return { success: true, data: res._id };
  } catch (err) {
    console.error('[addRecord] error:', err.message, err.stack);
    return { success: false, error: err.message };
  }
};