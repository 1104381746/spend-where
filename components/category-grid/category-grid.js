Component({
  properties: {
    type: { type: String, value: 'expense' },
    selected: { type: String, value: '' }
  },

  data: {
    categories: []
  },

  observers: {
    'type': function (type) {
      const { CATEGORY_MAP } = require('../../utils/constants');
      this.setData({ categories: CATEGORY_MAP[type] || CATEGORY_MAP.expense });
    }
  },

  methods: {
    onSelect(e) {
      const { name, icon } = e.currentTarget.dataset;
      this.setData({ selected: name });
      this.triggerEvent('select', { name, icon });
    }
  }
});