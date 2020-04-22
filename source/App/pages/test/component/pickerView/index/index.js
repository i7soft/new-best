const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1980; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Page({
  data: {
    aaa:{
      "fa[bbb]":'222222',
      bbb:'55555'
    },
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [9999, 1, 1],
    height:400,
    indicatorStyle:40
    // bobo:{
    //   value: [6, 1, 1],
    //   mimi:'123',
    //   sisi:[
    //     {
    //       picker: [6, 1, 1],
    //       input: 'bobo'
    //     },{
          
    //     }
    //   ]
    // }
  },
  bindChange: function (e) {
    console.log(e);
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },
  onLoad: function () {
    this.onPullDownRefresh = function () {
      console.log("onPullDownRefresh");
    };

    //触底加载下一页
    this.onReachBottom = function () {
      console.log("onReachBottom");
    };
  },
  aaa: function (e) {
    console.log(e)
  },
  bbb: function (e) {
    // this.setData({'value[0]':6})
    // console.log(this.data.value)
    // this.setData({ value: [6, 1, 1] })
    // this.setData({ 'bobo.sisi[0].picker[0]': 10 });
    this.setData({bobo:{
      value: [6, 1, 1],
      mimi:'123',
      sisi:[
        {
          picker: [6, 1, 1],
          input: 'bobo'
        },{
          
        }
      ]
    }})
    console.log(this.data.bobo)
  },
  ccc: function (e) {
    this.setData({ 'aaa.bbb': '6666' })
    // this.setData({ value: [9999, 1, 1] })
  },
  // onPullDownRefresh: function () {
  //   console.log("onPullDownRefresh");
  // },

  // //触底加载下一页
  onReachBottom: function () {
    // console.log("onReachBottom");
  },
  setHeight:function(){
    
    this.setData({height:200,indicatorStyle:50})
  },
  changeColumnRows:function(){
    this.setData({
      months: [1, 2, 3]
    })
  }
})