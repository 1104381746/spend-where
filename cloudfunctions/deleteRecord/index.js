// 删除记录
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { _id } = event;
  const { OPENID } = cloud.getWXContext();

  if (!_id) {
    return { success: false, error: '缺少记录ID' };
  }

  try {
    const res = await db.collection('records')
      .where({ _id, openid: OPENID })
      .remove();

    return { success: true, deleted: res.stats.removed };
  } catch (err) {
    return { success: false, error: err.message };
  }
};