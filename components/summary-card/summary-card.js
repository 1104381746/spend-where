Component({
  properties: {
    totalIncome: { type: Number, value: 0 },
    totalExpense: { type: Number, value: 0 },
    balance: { type: Number, value: 0 },
    monthLabel: { type: String, value: '' }
  },

  data: {
    formattedIncome: '0.00',
    formattedExpense: '0.00',
    formattedBalance: '0.00'
  },

  observers: {
    'totalIncome': function (v) {
      this.setData({ formattedIncome: (v || 0).toFixed(2) });
    },
    'totalExpense': function (v) {
      this.setData({ formattedExpense: (v || 0).toFixed(2) });
    },
    'balance': function (v) {
      this.setData({ formattedBalance: (v || 0).toFixed(2) });
    }
  }
});