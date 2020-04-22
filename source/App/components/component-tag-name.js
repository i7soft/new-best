// components/component-tag-name.js
Component({
  properties: {},
  methods: {
    onTap: function () {console.log(this);
      // this.triggerEvent('customevent', {}) // 只会触发 pageEventListener2
      // this.triggerEvent('customevent', {}, { bubbles: true }) // 会依次触发 pageEventListener2 、 pageEventListener1
      this.triggerEvent('customevent', {}, { bubbles: true, composed: true, capturePhase:true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1
    }
  }
})