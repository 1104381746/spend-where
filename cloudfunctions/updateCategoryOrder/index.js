const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { orders } = event; // [{ _id, order }, ...]

  if (!orders || !orders.length) return { success: false, error: '参数错误' };

  try {
    await Promise.all(orders.map(({ _id, order }) =>
      db.collection('categories').doc(_id).update({ data: { order } })
    ));
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
