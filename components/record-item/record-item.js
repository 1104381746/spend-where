const { CATEGORY_MAP } = require('../../utils/constants');
const util = require('../../utils/util');

Component({
  properties: {
    record: { type: Object, value: null }
  },

  data: {
    formattedAmount: '0.00',
    amountColor: '',
    amountPrefix: '',
    category: '',
    categoryIcon: '',
    note: '',
    type: '',
    time: '',
    iconBgColor: '#f0f0f0'
  },

  observers: {
    'record': function (record) {
      if (!record) return;
      const isExpense = record.type === 'expense';

      // 从常量中查找分类图标和颜色
      const categories = CATEGORY_MAP[record.type] || CATEGORY_MAP.expense;
      const catInfo = categories.find(c => c.name === record.category);

      // 格式化时间
      let timeStr = '';
      if (record.createdAt) {
        timeStr = util.formatTime(record.createdAt);
      }

      this.setData({
        formattedAmount: (record.amount || 0).toFixed(2),
        amountColor: isExpense ? '#EE0A24' : '#07C160',
        amountPrefix: isExpense ? '-' : '+',
        category: record.category || '',
        categoryIcon: catInfo ? catInfo.icon : '',
        note: record.note || '',
        type: record.type || '',
        time: timeStr,
        iconBgColor: catInfo ? (catInfo.color + '20') : '#f0f0f0'
      });
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('taprecord', { record: this.properties.record });
    },

    onLongPress() {
      this.triggerEvent('deleterecord', { record: this.properties.record });
    }
  }
});