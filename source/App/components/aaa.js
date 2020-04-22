// components/aaa.js
var myBehavior = require('my-behavior');
var myBehavior2 = require('my-behavior');
console.log(myBehavior2)
Component({
  behaviors: [myBehavior],
  properties: {
    myProperty: {
      type: String
    }
  },
  data: {
    myData: {},
    list: [1, 3, 5],
    aaa:{
      a:1,
    }
  },
  attached: function () {console.log(this.hasBehavior(myBehavior)) },

  /**
   * 组件的方法列表
   */
  methods: {
    onEvent: function () {
      console.log('in-aaa')
    },
    bbb: function () {
      console.log('bbb')
    },
    ccc: function () {
      console.log('ccc')
    },
    myBehaviorMethod: function () {console.log('bobo') },
  }
})
