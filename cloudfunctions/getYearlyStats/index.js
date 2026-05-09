// 获取年度统计 - 总收入/支出 + 每月汇总 + 分类汇总
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { year } = event;
  const { OPENID } = cloud.getWXContext();

  if (!year) {
    return { success: false, error: '缺少年份参数' };
  }

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);

  try {
    const res = await db.collection('records')
      .where({ openid: OPENID, date: _.gte(start).lte(end) })
      .limit(1000)
      .get();

    const records = res.data;
    let totalIncome = 0;
    let totalExpense = 0;
    const monthlyMap = {};
    const categoryMap = {};

    records.forEach(record => {
      const amount = record.amount || 0;
      const d = record.date instanceof Date ? record.date : new Date(record.date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (record.type === 'income') totalIncome += amount;
      else totalExpense += amount;

      if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { month: monthKey, income: 0, expense: 0 };
      if (record.type === 'income') monthlyMap[monthKey].income += amount;
      else monthlyMap[monthKey].expense += amount;

      if (record.type === 'expense') {
        const cat = record.category || '其他';
        if (!categoryMap[cat]) categoryMap[cat] = { name: cat, amount: 0, count: 0 };
        categoryMap[cat].amount += amount;
        categoryMap[cat].count += 1;
      }
    });

    const monthlyList = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
    const categoryList = Object.values(categoryMap).sort((a, b) => b.amount - a.amount);

    return {
      success: true,
      data: {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpense: Math.round(totalExpense * 100) / 100,
        balance: Math.round((totalIncome - totalExpense) * 100) / 100,
        monthly: monthlyList,
        categories: categoryList
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};