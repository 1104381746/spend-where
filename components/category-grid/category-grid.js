Component({
  properties: {
    type: { type: String, value: 'expense' },
    selected: { type: String, value: '' },
    list: { type: Array, value: null }
  },

  data: {
    categories: []
  },

  observers: {
    'list, type': function (list, type) {
      if (list && list.length > 0) {
        this.setData({ categories: list });
      } else {
        const { CATEGORY_MAP } = require('../../utils/constants');
        this.setData({ categories: CATEGORY_MAP[type] || CATEGORY_MAP.expense });
      }
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