Page({
  data: {
    html: '<div class="div_class" style="line-height: 60px; color: red;">Hello&nbsp;World!</div>',
    nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'height: 120rpx; color: red;'
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }]
  },
  tap() {
    console.log('tap');
    this.setData({html:'<div class="div_class" style="line-height: 60rpx; color: red;">Hello          World!</div>'})
  }
})