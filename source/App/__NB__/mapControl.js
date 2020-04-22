//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :mapWrapper.js
//        description : 地图核心控制组件。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');

var Px=require('./utils/Px');

// var map_sdk=require('./map/index');

var isApp=NB && NB.IsApp,isWechat=NB && NB.IsWechat,isMobile=NB.IsMobile,isWeb=NB.IsWeb;//可以根据平台的不同，向用户展示不同的分享界面

// var map_api;

// if(isWeb){
//     var map=NBConfig.runtime.web.map;
//     var map_use=map.use;
//     map_api=map_sdk.web[map_use];
// }

//初始化地图
// map_api.init();

// var TYPE_STRING=String;
function setData(that,data){
    that.setData(data);
}

function triggerChangeEvent(that,detail){
    that.triggerEvent('change',detail);
}

var skew_max=80;

function getSkewLegalValue(value){
    if(value<0)value=0;
    else if(value>skew_max)value=skew_max;
    return value;
}

function getX(touch){
    return touch.clientX || touch.pageX;
}

function getY(touch){
    return touch.clientY || touch.pageY;
}

Component({

    externalClasses:["nb-icon","nb-icon-up","nb-icon-plus","nb-icon-minus"],

    /**
     * 组件的属性列表
     */
    properties: {
        scale:Number,
        rotate:{
            type: Number,
            value:0,
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _rotate:newVal
                })
            }
        },
        skew:{
            type: Number,
            value:0,
            observer: function (newVal) {
                var that=this;

                newVal=getSkewLegalValue(newVal);
          
                setData(that,{
                    _skew:newVal,
                    _mode:newVal>0?'3D':'2D'
                })
            }
        },
        enableOverlooking:{
            type: Boolean,
            value:false,
            observer: function (newVal) {
                var that=this;
          
                setData(that,{
                    _enableOverlooking:newVal,
                })
            }
        },
        enableZoom:{
            type: Boolean,
            value:true,
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _enableZoom:newVal
                })
            }
        },
        enableRotate:{
            type: Boolean,
            value:false,
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _enableRotate:newVal
                })
            }
        },
        enableSatellite:{
            type: Boolean,
            value:false,
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _enableSatellite:newVal
                })
            }
        },
        enableTraffic:{
            type: Boolean,
            value:false,
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _enableTraffic:newVal
                })
            }
        },

        //显示卫星地图按钮
        showSatellite:{
            type: Boolean,
            value:false,
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _showSatellite:newVal
                })
            }
        },

        //显示交通地图按钮
        showTraffic:{
            type: Boolean,
            value:false,
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _showTraffic:newVal
                })
            }
        },

        //显示我的位置按钮
        showLocation:{
            type: Boolean,
            value:false,
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _showLocation:newVal
                })
            }
        },

        //左上角偏移量
        topLeftMargin:{
            type:Object,
            value:{x:0,y:0},
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _topLeftMargin:{x:Px(newVal.x),y:Px(newVal.y)}
                })
            }
        },

        //右上角偏移量
        topRightMargin:{
            type:Object,
            value:{x:0,y:0},
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _topRightMargin:{x:Px(newVal.x),y:Px(newVal.y)}
                })
            }
        },

        //左下角偏移量
        bottomLeftMargin:{
            type:Object,
            value:{x:0,y:0},
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _bottomLeftMargin:{x:Px(newVal.x),y:Px(newVal.y)}
                })
            }
        },

        //右下角偏移量
        bottomRightMargin:{
            type:Object,
            value:{x:0,y:0},
            observer: function (newVal) {
                var that=this;
                setData(that,{
                    _bottomRightMargin:{x:Px(newVal.x),y:Px(newVal.y)}
                })
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
       _enableOverlooking:false,
       _enableZoom:true,
       _enableRotate:false,
       _mode:'2D',
       _skew:0,
       _rotate:0
    },


    /**
     * 组件的方法列表
     */
    methods: {
        changeSatellite:function(){
            var that=this;
            var value=!that.data._enableSatellite;
            setData(that,{
                _enableSatellite:value
            });
            triggerChangeEvent(that,{
                enableSatellite:value
            });
        },
        changeTraffic:function(){
            var that=this;
            var value=!that.data._enableTraffic;
            setData(that,{
                _enableTraffic:value
            });
            triggerChangeEvent(that,{
                enableTraffic:value
            });
        },
        myLocation:function(){
            var that=this;
            triggerChangeEvent(that,{
                showLocation:true
            });


            //移动地图到定位点
            wx.getLocation({
                type:'gcj02',
                success:function(res){
                    // wx.hideLoading();
                    triggerChangeEvent(that,{
                        latitude:res.latitude,
                        longitude:res.longitude
                    });
                },
           
            })
        },
        zoomIn:function(){
            var that=this;
            var scale=that.properties.scale;
            ++scale;
        
            triggerChangeEvent(that,{
                scale:scale
            });
          
        },
        zoomOut:function(){
            var that=this;
            var scale=that.properties.scale;
            --scale;
           
            triggerChangeEvent(that,{
                scale:scale
            });
        },
        changeMode:function(){
            var that=this;
            var map=that.map;
            var mode=that.data._mode;
            var next_is_3d=mode=='2D';
            mode=next_is_3d?'3D':'2D';
            var skew=next_is_3d?60:0;

            var temp_skew=start_skew=that.data._skew;

            if(that.timer_skew)clearInterval(that.timer_skew);

            //动画改变倾角
            that.timer_skew=setInterval(function(){

                if((skew>start_skew && temp_skew>=skew) || (skew<start_skew && temp_skew<=skew) ){
                    clearInterval(that.timer_skew);
                    return;
                }

                temp_skew+=skew>start_skew?10:-10;

                temp_skew=getSkewLegalValue(temp_skew);

                triggerChangeEvent(that,{
                    skew:temp_skew
                });
                setData(that,{
                    _mode:mode,
                    _skew:temp_skew
                })

            },17);

           
        },
        skewStart:function(e){

            if(!e.touches)e.touches=[e];

            var that=this;

            that.flag_skewStart=true;

            var touch=e.touches[0];

            that.skewStartY=getY(touch);

        },
        skewMove:function(e){

            if(!e.touches)e.touches=[e];

            var that=this;

            if(!that.flag_skewStart) return;

            var touch=e.touches[0];

            var currentY=getY(touch);

            var startY=that.skewStartY;

            that.skewStartY=currentY;

            var value=currentY-startY;

            var skew=that.data._skew-value;

            skew=getSkewLegalValue(skew);

            triggerChangeEvent(that,{
                skew:skew
            });

            setData(that,{
                _skew:skew,
                _mode:skew==0?'2D':'3D'
            });

            return false;

        },
        skewEnd:function(){

            var that=this;

            that.flag_skewStart=false;

        },
        restoreRotate:function(){
            var that=this;
            var map=that.map;

            var temp_rotate=start_rotate=that.data._rotate;

            if(that.timer_rotate)clearInterval(that.timer_rotate);

            //动画改变倾角
            that.timer_rotate=setInterval(function(){

                if(temp_rotate==0){
                    clearInterval(that.timer_rotate);
                    return;
                }


                temp_rotate+=start_rotate>180?10:-10;

                if(temp_rotate<0 || temp_rotate>360)temp_rotate=0;

               

                triggerChangeEvent(that,{
                    rotate:temp_rotate
                });

                setData(that,{
                    _rotate:temp_rotate
                })

            },17);
        },
        rotateStart:function(e){

            if(!e.touches)e.touches=[e];

            var that=this;

            that.flag_restoreStart=true;

            var touch=e.touches[0];

            that.rotateStartX=getX(touch);
            that.rotateStartY=getY(touch);
            that.rotateStartValue=that.data._rotate;
       

        },
        rotateMove:function(e){

            if(!e.touches)e.touches=[e];

            var that=this;

            if(!that.flag_restoreStart) return;

            var touch=e.touches[0];

            var x1=that.rotateStartX;
            var y1=that.rotateStartY;

            var x2=getX(touch);
            var y2=getY(touch);


            var query=that.createSelectorQuery();

            query.select('.ring').boundingClientRect(function(rect){
             
                var x=rect.left,y=rect.top,width=rect.width,height=rect.height;

                // 参考文章：
                // https://www.cnblogs.com/webhmy/p/9700079.html
                
                //中心点
                var cx = x + width / 2;
                var cy = y + height / 2;
            
                //2个点之间的角度获取
                var c1 = Math.atan2(y1 - cy, x1 - cx) * 180 / (Math.PI);
                var c2 = Math.atan2(y2 - cy, x2 - cx) * 180 / (Math.PI);
                var angle;
                c1 = c1 <= -90 ? (360 + c1) : c1;
                c2 = c2 <= -90 ? (360 + c2) : c2;
            
                //夹角获取
                angle = Math.floor(c2 - c1);
                angle = angle < 0 ? angle + 360 : angle;

                var startAngle = that.rotateStartValue;
                var deg;

                // 赋值的旋转角度
                var rotate;

                // 顺时针旋转
                if (x2 - x1 > 0) {
                    deg = startAngle + angle;
                    rotate = deg > 360 ? deg - 360 : deg;
                } else {
                    // 逆时针旋转
                    angle = 360 - angle;
                    deg = startAngle - angle;
                    rotate = deg < 0 ? deg + 360 : deg;
                }


                triggerChangeEvent(that,{
                    rotate:rotate
                });

                setData(that,{
                    _rotate:rotate
                });
            });
        
            return false;
        },
        rotateEnd:function(){

            var that=this;

            that.flag_restoreStart=false;

        }
       
    }
})