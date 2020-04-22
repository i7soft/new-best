const app = getApp()

Page({
  data: {
    aaa:[
      'bobo'//,'mimi','nini'
    ],
    color:'#000',
    bbb:[
      ['mimi']
    ]
  },
  onLoad: function () {

    console.log('page-load');

    console.log(this.data.bbb[0][0]);

    this.setData({'bbb[0][0]':'nini'})

    console.log(this.data.bbb[0][0]);

    var query = this.createSelectorQuery();

    // var nodes = query.select('#bbb').exec();

    // console.log(nodes);
    this.createSelectorQuery().select('.nini > .bbb').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    }, function (res) {
      console.log(res);
      // res.dataset // 节点的dataset
      // res.width // 节点的宽度
      // res.height // 节点的高度
      // res.scrollLeft // 节点的水平滚动位置
      // res.scrollTop // 节点的竖直滚动位置
      // res.scrollX // 节点 scroll-x 属性的当前值
      // res.scrollY // 节点 scroll-y 属性的当前值
      // // 此处返回指定要返回的样式名
      // res.margin
      // res.backgroundColor
    }).exec()

    // console.log(nodes);

    var that=this;

    setTimeout(function(){

      // that.setData({aaa:['mimi','nini','bobo']});
      that.setData({flag:true});
      console.log('change');

    },15000);

    // wx.showToast({
    //   // icon:'none',
    //   title: '1111',
    //   duration:500000000,
    //   success:function(e){
    //     console.log(e);
    //   },
    //   // complete:function(e){
    //   //   console.log(e);
    //   // }
    // })

  },
  onReady:function(){
    console.log('page-ready')
    var nodes = this.selectAllComponents('.nini .bbb');
    console.log(nodes);
  },
  onShow:function(){
    console.log('page-show')
  },
  onHide: function () {
    console.log('page-hide')
  },
  ontap:function(){
    this.setData({color:'#ff0000'})
  },
  handleTap1: function (e) {
    console.log(1)
    console.log(e)
  },
  handleTap2: function (e) {
    console.log(2)
    console.log(e)
  },
  handleTap3: function (e) {
    console.log(3)
    console.log(e)
  },
})
