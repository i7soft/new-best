var pageData = {
  data:{
    value:0
  },
  tap:function(){
    this.setData({
      value:60
    })
  }
}
for (var i = 1; i < 5; ++i) {
  (function (index) {
    pageData[`slider${index}change`] = function (e) {
      console.log(`slider${index}发生change事件，携带值为`, e.detail.value)
    }
  })(i);
}
pageData.aaa=function(e){
  console.log(e)
}
Page(pageData)