Page({
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    current: 2,
    indicatorColor:'#ff0000',
    // currentId:'demo-text-3',
    images: ['https://farm4.staticflickr.com/3920/15008465772_d50c8f0531_h.jpg',
    'https://farm6.staticflickr.com/5584/14985868676_b51baa4071_h.jpg',
    'https://farm4.staticflickr.com/3902/14985871946_24f47d4b53_h.jpg'
    ],
    items:[
      {
        value:true
      },
      {
        value:false
      }
    ],
    items2:{
      items:[
        {
          value:true
        },
        {
          value:false
        }
      ]
    }
  },
  aaa: function (e) {
    console.log(e);
  },
  bbb: function (e) {
   
    this.setData({ 
      // items: [
      //   {
      //     value: true
      //   },
      //   {
      //     value: false
      //   },{
      //     value:true
      //   }
      // ]
      // current: 1 ,
      indicatorColor:'#00ff00',
      background: ['demo-text-1', 
       'demo-text-3'
      ]
    })
  },
  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
    // console.log(newData);
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad:function(){
    // setTimeout(function(){
    //   wx.startPullDownRefresh();
    // },10000);
  },
  onPullDownRefresh:function(){
    setTimeout(function(){
      wx.stopPullDownRefresh();
    },3000);
  },
  bindtransition:function(e){
    // console.log(e.detail);
  }
})
