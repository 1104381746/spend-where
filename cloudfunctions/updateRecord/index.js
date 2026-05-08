// 更新记录
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { _id, amount, type, category, categoryIcon, note, date } = event;
  const { OPENID } = cloud.getWXContext();

  if (!_id) {
    return { success: false, error: '缺少记录ID' };
  }

  const updateData = {};
  if (amount !== undefined) updateData.amount = Number(amount);
  if (type) updateData.type = type;
  if (category) updateData.category = category;
  if (categoryIcon) updateData.categoryIcon = categoryIcon;
  if (note !== undefined) updateData.note = note;
  if (date) updateData.date = new Date(date);
  updateData.updatedAt = new Date();

  try {
    const res = await db.collection('records')
      .where({ _id, openid: OPENID })
      .update({ data: updateData });

    return { success: true, updated: res.stats.updated };
  } catch (err) {
    return { success: false, error: err.message };
  }
};