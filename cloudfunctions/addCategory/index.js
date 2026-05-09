const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { name, icon, type, imageUrl } = event;

  if (!name || !icon || !type) {
    return { success: false, error: '参数不完整' };
  }

  try {
    const existing = await db.collection('categories')
      .where({ openid: OPENID, name, type })
      .count();
    if (existing.total > 0) {
      return { success: false, error: '该分类已存在' };
    }

    const countRes = await db.collection('categories')
      .where({ openid: OPENID, type })
      .count();

    const res = await db.collection('categories').add({
      data: {
        openid: OPENID, name, icon, type,
        imageUrl: imageUrl || '',
        color: '#90A4AE',
        isDefault: false, hidden: false,
        order: countRes.total,
        createdAt: db.serverDate()
      }
    });
    return { success: true, data: { _id: res._id } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
