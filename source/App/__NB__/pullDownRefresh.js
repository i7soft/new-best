//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :pullDownRefresh.js
//        description : page 下拉刷新动画

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var pullDownRefresh_height=1000;

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        mode:String,//dark/light
        duration:Number,
        height: {
            type: Number,
            value: 0,
            observer: function (newVal) {
                var that=this;
                var properties=that.properties;
                var animation = wx.createAnimation({
                    duration: properties.duration,
                    timingFunction: 'ease',
                });
                animation.translate3d(0,newVal-pullDownRefresh_height,0).step();
                var data={
                    _color:properties.mode=='light'?'#fff':'#888',
                    animationData:animation.export()
                }
                if(!properties.refresh){//不刷新的时候才允许通过高度的值来改变动画
                    var max_height=newVal>100?100:newVal;

                    var max_pullDownHeihgt=100;
                    var refresh_height=50;
                    var item_split=32;
                    var item_top=20;

                    var itemList=[];
                    itemList.push({
                        opacity:1,
                        left:-(max_height<refresh_height?0:
                            (max_height-refresh_height)*item_split/max_pullDownHeihgt),
                        scale:max_height<item_top?0:
                            max_height<refresh_height?
                                1*(max_height-item_top)/(refresh_height-item_top):1
                    });
                    itemList.push({
                        opacity:max_height<refresh_height?1:1-0.25*max_height/max_pullDownHeihgt,
                        left:0,
                        scale:max_height<item_top?0:
                            max_height<refresh_height?1.5*(max_height-item_top)/(refresh_height-item_top):
                                1+(max_pullDownHeihgt-max_height)/max_pullDownHeihgt
                    });
                    itemList.push({
                        opacity:max_height<refresh_height?1:1-0.65*max_height/max_pullDownHeihgt,
                        left:(max_height<refresh_height?0:
                            (max_height-refresh_height)*item_split/max_pullDownHeihgt),
                        scale:max_height<item_top?0:
                            max_height<refresh_height?
                                1*(max_height-item_top)/(refresh_height-item_top):1
                    });

                    data.itemList=itemList;
                }
      
                
                that.setData(data);
            }
        },
        refresh:{
            type:Boolean,
            value:false,
            observer:function(newVal){
                this.setData({_refresh:newVal})
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationData: {},
        _color:'',
        itemList:[],
        _height:0,
        _refresh:false
    },


    /**
     * 组件的方法列表
     */
    methods: {
        // onTransitionEnd:function(e){
        //     var that=this;
        //     that.willShow=false;
        //     if(that.willHide){
        //         that.willHide=false;
        //         that.setData({_show: false,_range:[]});
        //     }
        // },
       
    }
})