Component({
  properties: {
    type: { type: String, value: 'expense' },
    selected: { type: String, value: '' },
    list: { type: Array, value: null },
    maxDisplay: { type: Number, value: 8 }
  },

  data: {
    categories: [],
    displayList: [],
    expanded: false,
    hasMore: false
  },

  observers: {
    'list, type': function (list, type) {
      if (list && list.length > 0) {
        this.setData({ categories: list });
      } else {
        const { CATEGORY_MAP } = require('../../utils/constants');
        this.setData({ categories: CATEGORY_MAP[type] || CATEGORY_MAP.expense });
      }
    },
    'categories, maxDisplay, expanded': function (categories, maxDisplay, expanded) {
      if (categories && categories.length > 0) {
        const displayList = expanded ? categories : categories.slice(0, maxDisplay);
        this.setData({
          displayList: displayList,
          hasMore: categories.length > maxDisplay
        });
      }
    }
  },

  methods: {
    onSelect(e) {
      const { name, icon } = e.currentTarget.dataset;
      this.setData({ selected: name });
      this.triggerEvent('select', { name, icon });
    },
    toggleExpand() {
      this.setData({ expanded: !this.data.expanded });
    }
  }
});