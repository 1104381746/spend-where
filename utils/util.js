function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const d = new Date(dateStr);

  if (d.toDateString() === today.toDateString()) return '今天';
  if (d.toDateString() === yesterday.toDateString()) return '昨天';

  const day = d.getDay();
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 周${dayNames[day]}`;
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatAmount(amount) {
  if (amount === undefined || amount === null) return '0.00';
  return Number(amount).toFixed(2);
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthRange(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

function getDateArray(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const arr = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const d = String(i).padStart(2, '0');
    arr.push(`${monthStr}-${d}`);
  }
  return arr;
}

function formatShortDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatMonthLabel(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  return `${year}年${month}月`;
}

function getMonthOffset(monthStr, offset) {
  const [year, month] = monthStr.split('-').map(Number);
  const totalMonths = year * 12 + (month - 1) + offset;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12 + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

module.exports = {
  formatDate,
  formatTime,
  formatShortDate,
  formatAmount,
  getCurrentMonth,
  getMonthRange,
  getDateArray,
  formatMonthLabel,
  getMonthOffset
};