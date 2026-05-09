const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

const DEFAULT_EXPENSE = [
  { name: '餐饮', icon: '🍔', color: '#FF6B6B' },
  { name: '交通', icon: '🚗', color: '#4ECDC4' },
  { name: '购物', icon: '🛒', color: '#FFB347' },
  { name: '娱乐', icon: '🎮', color: '#A66CFF' },
  { name: '住房', icon: '🏠', color: '#FF8A65' },
  { name: '医疗', icon: '🏥', color: '#4FC3F7' },
  { name: '教育', icon: '📚', color: '#FFD54F' },
  { name: '其他', icon: '📦', color: '#90A4AE' }
];

const DEFAULT_INCOME = [
  { name: '工资', icon: '💰', color: '#07C160' },
  { name: '奖金', icon: '🎉', color: '#FF6B6B' },
  { name: '投资理财', icon: '📈', color: '#A66CFF' },
  { name: '兼职', icon: '💼', color: '#FFB347' },
  { name: '红包', icon: '🧧', color: '#FF4757' },
  { name: '其他', icon: '📦', color: '#90A4AE' }
];

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();

  try {
    const { data } = await db.collection('categories')
      .where(_.or([{ openid: OPENID }, { isDefault: true }]))
      .orderBy('order', 'asc')
      .limit(100)
      .get();

    if (data.length === 0) {
      const batch = [];
      DEFAULT_EXPENSE.forEach((c, i) => {
        batch.push({ ...c, type: 'expense', openid: OPENID, isDefault: true, hidden: false, order: i, createdAt: db.serverDate() });
      });
      DEFAULT_INCOME.forEach((c, i) => {
        batch.push({ ...c, type: 'income', openid: OPENID, isDefault: true, hidden: false, order: i, createdAt: db.serverDate() });
      });

      for (const item of batch) {
        await db.collection('categories').add({ data: item });
      }

      const result = await db.collection('categories')
        .where({ openid: OPENID })
        .orderBy('order', 'asc')
        .get();
      return formatResult(result.data);
    }

    return formatResult(data.filter(c => !c.hidden));
  } catch (err) {
    return { success: false, error: err.message };
  }
};

function formatResult(list) {
  return {
    success: true,
    data: {
      expense: list.filter(c => c.type === 'expense'),
      income: list.filter(c => c.type === 'income')
    }
  };
}
