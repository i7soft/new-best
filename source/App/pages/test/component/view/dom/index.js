const app = getApp()

Page({
  data: {
    aaa:false
  },
  onLoad: function () {
    var that=this;
    setTimeout(function(){
      that.setData({aaa:true});
      setTimeout(function(){
        that.setData({aaa:false})
      },10000);
    },10000);
  },
  aaa:function(e){
    // console.log(e)
  }
})
