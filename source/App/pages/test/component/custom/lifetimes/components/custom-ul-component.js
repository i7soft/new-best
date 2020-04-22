// path/to/custom-ul.js
// var aaa=require('../aaa.js')
Component({
  relations: {
    './custom-li-component': {
      type: 'descendant', // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        // console.log('[custom-ul] a child is linked: ', target)
      },
      linkChanged: function (target) {
        console.log('linkChanged');
        console.log(target);
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
        console.log(target)
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
        var nodes=this.getRelationNodes('./custom-li-component');
        console.log(nodes);
      }
    }
  },
  behaviors: ['wx://form-field', require('./beh.js'),'wx://component-export'],
  data:{
    a:0
  },
  export() {
    return { myField: 'myValue' }
  },
  methods: {
    bbb:999,
    aaa:function(e){
      console.log(888);
    },
    _getAllLi: function () {
      // console.log(this);
      // console.log(this.bbb);
      this.aaa();
      // 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
      var nodes = this.getRelationNodes('./custom-li-component')
      console.log(nodes)
    }
  },
  aaa:999,
  // ready: function () {
  //   this._getAllLi();
  //   var nodes = this.selectComponent('.bbb');
  //   console.log(nodes);
  //   // console.log(this.bbb);
  // },
  created: function () {
    console.log('ul-created');
    // this.setData({a:1})
    // wx.showToast({
    //   // icon:'none',
    //   title: '1111',
    //   duration: 500000000,
    //   success: function (e) {
    //     console.log(e);
    //   },
    //   // complete:function(e){
    //   //   console.log(e);
    //   // }
    // })
  },
  attached: function () {
    console.log('ul-attached');
    var nodes = this.getRelationNodes('./custom-li-component')
    console.log(nodes)
    // console.log(this.data.a);
  },
  ready: function () {
    console.log('ul-ready');
    var nodes = this.getRelationNodes('./custom-li-component')
    console.log(nodes)
    // var nodes = this.getRelationNodes('./custom-ul-component')
    // console.log(nodes)

    // this.createSelectorQuery().select('.wrapper >>> .ccc').fields({
    //   dataset: true,
    //   size: true,
    //   scrollOffset: true,
    //   properties: ['scrollX', 'scrollY'],
    //   computedStyle: ['margin', 'backgroundColor']
    // }, function (res) {
    //   console.log(res);
    //   // res.dataset // 节点的dataset
    //   // res.width // 节点的宽度
    //   // res.height // 节点的高度
    //   // res.scrollLeft // 节点的水平滚动位置
    //   // res.scrollTop // 节点的竖直滚动位置
    //   // res.scrollX // 节点 scroll-x 属性的当前值
    //   // res.scrollY // 节点 scroll-y 属性的当前值
    //   // // 此处返回指定要返回的样式名
    //   // res.margin
    //   // res.backgroundColor
    // }).exec()

    console.log(this.createSelectorQuery());
    console.log(wx.createSelectorQuery().in(this));
    console.log(wx.createSelectorQuery().select('.wrapper'));
    console.log(wx.createSelectorQuery().selectViewport(function(res){console.log(res)}));
    console.log(this.createSelectorQuery().selectAll('.wrapper'));
    console.log(wx.createSelectorQuery().in(this).selectAll('.wrapper').boundingClientRect(function(){}));
    this.createSelectorQuery().in(this).selectViewport('.wrapper').boundingClientRect(function (rects) {
      console.log(rects);
      // rects.forEach(function (rect) {
      //   rect.id      // 节点的ID
      //   rect.dataset // 节点的dataset
      //   rect.left    // 节点的左边界坐标
      //   rect.right   // 节点的右边界坐标
      //   rect.top     // 节点的上边界坐标
      //   rect.bottom  // 节点的下边界坐标
      //   rect.width   // 节点的宽度
      //   rect.height  // 节点的高度
      // })
    }).selectAll('.wrapper >>> .ccc').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY','hover-class'],
      computedStyle: ['margin', 'backgroundColor']
    }, function (res) {
      res.dataset // 节点的dataset
      res.width // 节点的宽度
      res.height // 节点的高度
      res.scrollLeft // 节点的水平滚动位置
      res.scrollTop // 节点的竖直滚动位置
      res.scrollX // 节点 scroll-x 属性的当前值
      res.scrollY // 节点 scroll-y 属性的当前值
      // 此处返回指定要返回的样式名
      res.margin
      res.backgroundColor
    }).exec(function(res){
      console.log(res);
    })
  },
  moved: function () {
    console.log('moved')
  },
  pageLifetimes: {
    show: function () {
      console.log('ul-page-show');
    },
    hide: function () {
      console.log('ul-page-hide');
    }
  }
})