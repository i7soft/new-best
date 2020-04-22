// path/to/custom-li.js
var bobo="shiqiren";
Component({
  behaviors: ['wx://form-field'],
  properties: {
    value: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, changedPath) {
        console.log(newVal);
      }
    },
  },
  relations: {
    './custom-ul-component': {
      type: 'ancestor', // 关联的目标节点应为父节点
      linked: function (target) {
        // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
        console.log('child linked to ', target);
        console.log(bobo)
      },
      linkChanged: function (target) {
        console.log(target)
        // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
      },
      unlinked: function (target) {
        // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
      }
    }
  },

  moved:function(){
    console.log('moved')
  }
})