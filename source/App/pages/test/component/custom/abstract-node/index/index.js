const app = getApp()

Page({
  data: {
    aaa:'custom-radio'
  },
  onLoad: function () {
    console.log('代码片段是一种迷你、可分享的小程序或小游戏项目，可用于分享小程序和小游戏的开发经验、展示组件和 API 的使用、复现开发问题和 Bug 等。可点击以下链接查看代码片段的详细文档：')
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html')
  },
  pageEventListener1: function(e) {
    console.log('pageEventListener1', e)
  },
  pageEventListener2: function (e) {
    console.log('pageEventListener2', e)
  },
  pageEventListener3: function (e) {
    console.log('pageEventListener3', e)
  },
  pageEventListener4: function (e) {
    console.log('pageEventListener4', e)
  },
  pageEventListener5: function (e) {
    console.log('pageEventListener5', e)
  },
  aaa:function(e){
    console.log('aaa');
  },
  bbb: function (e) {
    console.log('bbb');
  },
  ccc: function (e) {
    console.log('ccc');
  },
  handleTap1:function(e){
    console.log('handleTap1');
  },
  handleTap2: function (e) {
    console.log('handleTap2');
  },
  handleTap3: function (e) {
    console.log('handleTap3');
  },
  handleTap4: function (e) {
    console.log('handleTap4');
  },
  aaa:function(){
    console.log('aaa')
  },
  bbb: function () {
    console.log('bbb')
  },
  ccc: function () {
    console.log('ccc')
  }
})
