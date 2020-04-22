// components/ccc.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  aaa: 999,
  attached: function () { console.log(this.aaa) },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function () {
      // this.triggerEvent('customevent', {}) // 只会触发 pageEventListener2
      // this.triggerEvent('customevent', {}, { bubbles: true }) // 会依次触发 pageEventListener2 、 pageEventListener1
      this.triggerEvent('customevent', {}, { bubbles: true, composed: false, capturePhase: true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1
    }
  }
})
