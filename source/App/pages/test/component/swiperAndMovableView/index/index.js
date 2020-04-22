function rpx(rpxValue){
  return wx.getSystemInfoSync().screenWidth*rpxValue/750;
}

var swiper_width=rpx(750);
var swiper_height=rpx(800);

Page({
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    current: 0,
    images: ['https://farm4.staticflickr.com/3920/15008465772_d50c8f0531_h.jpg',
    'https://farm6.staticflickr.com/5584/14985868676_b51baa4071_h.jpg',
    'https://farm4.staticflickr.com/3902/14985871946_24f47d4b53_h.jpg'
    ],
    swiper_disabled:false,
    itemList:[
      {
        url:'https://farm4.staticflickr.com/3920/15008465772_d50c8f0531_h.jpg',
        x:0,
        y:0,
        width:0,
        height:0,
        originWidth:0,
        originHeight:0,
        scaleMax:1,
        scaleValue:1,
        isLock:false
      },
      {
        url:'https://farm6.staticflickr.com/5584/14985868676_b51baa4071_h.jpg',
        x:0,
        y:0,
        width:0,
        height:0,
        originWidth:0,
        originHeight:0,
        scaleMax:1,
        scaleValue:1,
        isLock:false
      },
      {
        url:'https://farm4.staticflickr.com/3902/14985871946_24f47d4b53_h.jpg',
        x:0,
        y:0,
        width:0,
        height:0,
        originWidth:0,
        originHeight:0,
        scaleMax:1,
        scaleValue:1,
        isLock:false
      },
    ],
    animationSlides:null
    // slides_left:0
  },
  methods:{
    getIndex:function(e){
      return e.currentTarget.dataset.index;
    }
  },
  temp:{
    itemList:[],
    current:0,
    startX:0,
    startY:0,
    startTime:0,
    lastTime:0,
    timespan:0,
    preTapPosition:{},
    isDoubleTap:false,
    lock:{//锁定移动边界
      top:false,
      right:false,
      bottom:false,
      left:false
    },
    // timer_longTap:null
  },
  onDragStart:function(e){

    var touches=e.touches;
    var that=this;
    var temp=that.temp;
    var methods=that.methods;

    var startTime=temp.startTime = Date.now();
    var startX=temp.startX = touches[0].pageX;
    var startY=temp.startY = touches[0].pageY;
    var timespan=temp.timespan = startTime - (temp.lastTime || startTime);

    // var preTapPosition=temp.preTapPosition;

    // if(preTapPosition.x!==null){
    //   temp.isDoubleTap = (timespan > 0 && timespan <= 250 && Math.abs(preTapPosition.x-startX)<30&&Math.abs(preTapPosition.y-startY)<30);
    // }
    // preTapPosition.x=startX;
    // preTapPosition.y=startY;
    temp.lastTime = startTime;

    var touch_length=touches.length;

    // var preV = this.preV,
    //     len = touches.length;

    // if (len > 1) {
    //      this._cancelLongTap();
    //      this._cancelSingleTap();
    //     var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
    //     preV.x = v.x;
    //     preV.y = v.y;
    //     this.pinchStartLen = this.getLen(preV);
    //     this._emitEvent('onMultipointStart', evt);
    // }
    // temp.timer_longTap = setTimeout(function(){
    //   //响应长按
    //     // this._emitEvent('onLongTap', evt);
    // }, 750);
  },
  onDragMove:function(e){
    e.preventDefault && e.preventDefault();

    var touches=e.touches;
    var that=this;
    var temp=that.temp;
    var methods=that.methods;

    var current=temp.current;

    var startX=temp.startX;
    var startY=temp.startY;

    var x = touches[0].pageX;
    var y = touches[0].pageY;

    var defualt_slides_left=-current*swiper_width;
    var distance=x-startX;
    var slides_left=defualt_slides_left+distance;

    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    });
    animation.translate3d(slides_left,0,0).step();

    console.log('onDragMove',Date.Now.toString('HH:mm:ss.fff'))

    that.setData({
      animationSlides:animation.export()
    })
  },
  onTouchEnd:function(e){

  },
  swiper_onChange:function(e){
    var that=this;
    var temp=that.temp;
    var current=e.detail.current;
    var left_item=current-1;
    var list=[];
    if(left_item>-1){
      list.push(left_item);
    }
    
    var right_item=current+1;
    if(right_item<that.data.itemList.length){
      list.push(right_item);
    }

    var data={};
    var list_length=list.length;
    var result_count=0;
    for(var i=0;i<list_length;i++){
      var index=list[i];
      if(temp.itemList[index].scaleValue>1){
        temp.itemList[index].scaleValue=1;
        result_count++;
        data['itemList['+index+'].scaleValue']=1;//相邻放大的图片恢复默认大小
      }
    }

    if(result_count>0)that.setData(data);
   
  },
  image_onScale:function(e){
    var that=this;
    var methods=that.methods;
    var temp=that.temp;
    var index=methods.getIndex(e);
    temp.itemList[index].scaleValue=e.detail.scale;
  },
  image_onTouchStart:function(e){
    var that=this;
    var methods=that.methods;
    var temp=that.temp;
    var index=methods.getIndex(e);

    if(temp.itemList[index].scaleValue>1){
        //todo:判断 image 如果超出了边界，是否需要锁定
    }

   
  },
  image_onTouchMove:function(e){
    //用来阻止 movableView 的触摸事件传递到 swiper
    //不需要有其他代码
  },
  image_onLoad:function(e){//console.log('onload')
  // console.log('image load',Date.Now.toString('HH:mm:ss.fff'))
    var that=this;
    var methods=that.methods;
    var temp=that.temp;
    var index=methods.getIndex(e);

    var detail=e.detail;
    var originWidth=detail.width;
    var originHeight=detail.height;
    // var width,height;

    // var box_ratio=swiper_width/swiper_height;
    // var image_ratio=originWidth/originHeight;

    // if(box_ratio>image_ratio){
    //   height=swiper_height;
    //   width=height*originWidth/originHeight;
    // }
    // else{
    //   width=swiper_width;
    //   height=width*originHeight/originWidth;
    // }

    var itemList=temp.itemList;


    // var item=that.data.itemList[index];
    // var data={};
    itemList[index]={
      // url:item.url,
      // width:width,
      // height:height,
      originWidth:originWidth,
      originHeight:originHeight,
      // x:(swiper_width-width)/2,
      // y:(swiper_height-height)/2,
      scaleMax:originWidth<swiper_width?1:originWidth/swiper_width,
      scaleValue:1
    };

    // console.log(that.data.itemList[index]);
    // that.setData(data);
    // console.log(that.data.itemList[index]);
    // console.log('image load finish',Date.Now.toString('HH:mm:ss.fff'))
  },
  aaa: function (e) {
    console.log(e);
  },
  bbb: function (e) {
    this.setData({ current: 1 })
  },
  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad:function(){
    // setTimeout(function(){
    //   wx.startPullDownRefresh();
    // },10000);
  },
  onPullDownRefresh:function(){
    setTimeout(function(){
      wx.stopPullDownRefresh();
    },3000);
  }
})
