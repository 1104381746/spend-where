const EXPENSE_CATEGORIES = [
  { name: '餐饮', icon: 'icon-food', color: '#FF6B6B' },
  { name: '交通', icon: 'icon-transport', color: '#4ECDC4' },
  { name: '购物', icon: 'icon-shopping', color: '#FFB347' },
  { name: '娱乐', icon: 'icon-entertain', color: '#A66CFF' },
  { name: '住房', icon: 'icon-housing', color: '#FF8A65' },
  { name: '医疗', icon: 'icon-medical', color: '#4FC3F7' },
  { name: '教育', icon: 'icon-education', color: '#FFD54F' },
  { name: '其他', icon: 'icon-other', color: '#90A4AE' }
];

const INCOME_CATEGORIES = [
  { name: '工资', icon: 'icon-salary', color: '#07C160' },
  { name: '奖金', icon: 'icon-bonus', color: '#FF6B6B' },
  { name: '投资理财', icon: 'icon-invest', color: '#A66CFF' },
  { name: '兼职', icon: 'icon-parttime', color: '#FFB347' },
  { name: '红包', icon: 'icon-redpacket', color: '#FF4757' },
  { name: '其他', icon: 'icon-other', color: '#90A4AE' }
];

const CATEGORY_MAP = {
  income: INCOME_CATEGORIES,
  expense: EXPENSE_CATEGORIES
};

const COLORS = {
  primary: '#07C160',
  income: '#07C160',
  expense: '#EE0A24',
  bg: '#F5F5F5',
  card: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textHint: '#999999',
  border: '#EEEEEE'
};

const PAGE_SIZE = 20;

module.exports = {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_MAP,
  COLORS,
  PAGE_SIZE
};