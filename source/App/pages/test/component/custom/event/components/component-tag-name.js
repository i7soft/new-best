// components/component-tag-name.js
Component({
  properties: {
    aaa: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
        console.log(newVal)
      }
    }
  },
  methods: {
    onTap: function () {
      // this.triggerEvent('customevent', {}) // 只会触发 pageEventListener2
      // this.triggerEvent('customevent', {}, { bubbles: true }) // 会依次触发 pageEventListener2 、 pageEventListener1
      this.triggerEvent('customevent', {}, { bubbles: true, composed: true, capturePhase:true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1
    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log('attached')
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
    ready(){
      console.log('ready')
    }
  },
})