// 获取月度统计 - 总收入/支出 + 每日明细 + 分类汇总
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { yearMonth } = event;
  const { OPENID } = cloud.getWXContext();

  if (!yearMonth) {
    return { success: false, error: '缺少年月参数' };
  }

  const [year, month] = yearMonth.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  try {
    const res = await db.collection('records')
      .where({ openid: OPENID, date: _.gte(start).lte(end) })
      .limit(1000)
      .get();

    const records = res.data;
    let totalIncome = 0;
    let totalExpense = 0;
    const dailyMap = {};
    const categoryMap = {};

    records.forEach(record => {
      const amount = record.amount || 0;
      const dateKey = record.date instanceof Date
        ? `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}-${String(record.date.getDate()).padStart(2, '0')}`
        : record.date;

      if (record.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      // 每日汇总
      if (!dailyMap[dateKey]) dailyMap[dateKey] = { date: dateKey, income: 0, expense: 0 };
      if (record.type === 'income') dailyMap[dateKey].income += amount;
      else dailyMap[dateKey].expense += amount;

      // 分类汇总（仅支出）
      if (record.type === 'expense') {
        const cat = record.category || '其他';
        if (!categoryMap[cat]) categoryMap[cat] = { name: cat, amount: 0, count: 0 };
        categoryMap[cat].amount += amount;
        categoryMap[cat].count += 1;
      }
    });

    const dailyList = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
    const categoryList = Object.values(categoryMap).sort((a, b) => b.amount - a.amount);

    return {
      success: true,
      data: {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
        balance: Math.round((totalIncome - totalExpense) * 100) / 100,
        daily: dailyList,
        categories: categoryList
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};