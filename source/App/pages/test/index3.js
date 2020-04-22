const app = getApp()

Page({
  data: {
    aaa:[
      'bobo','mimi','nini'
    ]
  },
  onLoad: function () {

    var that=this;

    setTimeout(function(){

      that.setData({aaa:['mimi','nini','bobo']});
      console.log('change');

    },5000);

    wx.showToast({
      // icon:'none',
      title: '1111',
      duration:500000000,
      success:function(e){
        console.log(e);
      },
      complete:function(e){
        console.log(e);
      }
    })

  },
})
