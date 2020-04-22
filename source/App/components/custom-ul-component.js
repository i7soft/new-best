// path/to/custom-ul.js
// var aaa=require('../aaa.js')
Component({
  relations: {
    './custom-li-component': {
      type: 'descendant', // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        console.log('[custom-ul] a child is linked: ', target)
      },
      linkChanged: function (target) {
        console.log(target);
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
        console.log(target)
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    }
  },
  methods: {
    bbb:999,
    aaa:function(e){
      console.log(888);
    },
    _getAllLi: function () {
      console.log(this);
      console.log(this.bbb);
      this.aaa();
      // 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
      // var nodes = this.getRelationNodes('./custom-li-component')
      // console.log(nodes)
    }
  },
  aaa:999,
  ready: function () {
    // this._getAllLi();
    // console.log(this.bbb);
  }
})