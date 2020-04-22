Page({
  data: {
    aaa:false,
    items: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' },
      { name: 'JPN', value: '日本' },
      { name: 'ENG', value: '英国' },
      { name: 'TUR', value: '法国' },
    ]
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    var items = [


      { name: 'BRA', value: '巴西' },
      { name: 'USA', value: '美国' },
      { name: 'JPN', value: '日本' },
      { name: 'CHN', value: '中国' },
    ];
    // this.setData({ items: items });
    
  },
  aaa:function(){
    this.setData({ aaa: true });
  }
})