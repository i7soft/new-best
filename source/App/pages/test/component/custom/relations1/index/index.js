const app = getApp()

Page({
  data: {
    aaa:[
      'bobo','mimi','nini'
    ],
    color:'#000'
  },
  onLoad: function () {

    var that=this;

    setTimeout(function(){

      that.setData({aaa:['mimi','nini']});
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
  ontap:function(){
    this.setData({color:'#ff0000'})
  },
  handleTap1: function (e) {
    console.log(1)
    console.log(e)
  },
  handleTap2: function (e) {
    console.log(2)
    console.log(e)
  },
  handleTap3: function (e) {
    console.log(3)
    console.log(e)
  },
})
