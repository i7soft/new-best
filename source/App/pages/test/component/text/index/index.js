var initData = 'this is first line\nthis is second line'
var extraLine = [];
Page({
  data: {
    text: initData,
    decode:true,
    decode2:false
  },
  add: function (e) {
    extraLine.push('other line')
    this.setData({
      text: initData + '\n' + extraLine.join('\n')
    })
  },
  remove: function (e) {
    if (extraLine.length > 0) {
      extraLine.pop()
      this.setData({
        text: initData + '\n' + extraLine.join('\n')
      })
    }
  },
  text_onTap:function(){
    this.setData({decode:!this.data.decode});
    console.log('...')
  },
  text_onTap2:function(){
    this.setData({decode2:!this.data.decode2});
  }
})