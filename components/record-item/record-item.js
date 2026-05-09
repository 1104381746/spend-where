const util = require('../../utils/util');

Component({
  properties: {
    record: { type: Object, value: null }
  },

  data: {
    formattedAmount: '0.00',
    category: '',
    categoryIcon: '',
    categoryImageUrl: '',
    note: '',
    type: '',
    time: '',
    iconBgColor: '#f0f0f0'
  },

  observers: {
    'record': function (record) {
      if (!record) return;
      let timeStr = '';
      if (record.createdAt) timeStr = util.formatTime(record.createdAt);

      this.setData({
        formattedAmount: (record.amount || 0).toFixed(2),
        category: record.category || '',
        categoryIcon: record.categoryIcon || record.icon || '',
        categoryImageUrl: record.categoryImageUrl || '',
        note: record.note || '',
        type: record.type || '',
        time: timeStr,
        iconBgColor: record.categoryColor ? (record.categoryColor + '20') : '#f0f0f0'
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
