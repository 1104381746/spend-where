const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { _id } = event;

  if (!_id) return { success: false, error: '缺少分类ID' };

  try {
    const { data } = await db.collection('categories').doc(_id).get();

    if (data.openid !== OPENID) {
      return { success: false, error: '无权限删除' };
    }
    if (data.isDefault) {
      return { success: false, error: '默认分类不可删除' };
    }

    await db.collection('categories').doc(_id).remove();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
