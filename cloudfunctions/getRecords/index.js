// 获取记录列表 - 分页查询，按日期倒序
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { page = 0, pageSize = 20, yearMonth } = event;
  const { OPENID } = cloud.getWXContext();

  let query = { openid: OPENID };

  if (event.date) {
    const d = new Date(event.date);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    query.date = _.gte(d).lt(next);
  } else if (yearMonth) {
    const [year, month] = yearMonth.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    query.date = _.gte(start).lte(end);
  }

  if (event.category) {
    query.category = event.category;
  }
  if (event.type) {
    query.type = event.type;
  }

  try {
    const countResult = await db.collection('records').where(query).count();
    const total = countResult.total;

    const res = await db.collection('records')
      .where(query)
      .orderBy('date', 'desc')
      .orderBy('createdAt', 'desc')
      .skip(page * pageSize)
      .limit(pageSize)
      .get();

    return {
      success: true,
      data: res.data,
      total,
      hasMore: (page + 1) * pageSize < total
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};