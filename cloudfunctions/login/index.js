const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { nickName, avatarUrl } = event;

  try {
    const { data } = await db.collection('users').where({ openid: OPENID }).get();

    if (data.length > 0) {
      await db.collection('users').doc(data[0]._id).update({
        data: { nickName, avatarUrl, updatedAt: db.serverDate() }
      });
      return { success: true, data: { ...data[0], nickName, avatarUrl } };
    }

    const user = { openid: OPENID, nickName, avatarUrl, createdAt: db.serverDate(), updatedAt: db.serverDate() };
    const res = await db.collection('users').add({ data: user });
    return { success: true, data: { _id: res._id, ...user } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
