//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :goHome.js
//        description : 如果初始打开的页面不是首页（tabBar 的页面除外），显示的返回首页漂浮按钮。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================



function setData(that,data){
    that.setData(data);
}

var storageKey="nb:goHome";

var startX,startY,nowX,nowY,tempLeft,tempTop

var flag_touching,flag_timerReady,flag_inertiaing,ts_timerStart;

var timer_hide;

var opacity_active=0.8,opacity_normal=0.25;

//小球的信息
var ballInfo;

//移动小球
function move(that,x,y,duration,opacity){
    var animation=wx.createAnimation({
        duration: duration ||0
    });


    animation.translate3d(x,y,0).opacity(opacity || opacity_active).step();
    
    setData(that,{
        animation:animation.export()
    });
}

function moveFinish(that,duration){

    timer_hide=setTimeout(function(){
        var animation=wx.createAnimation({
            duration: 500,
            timingFunction: 'ease'
        });
    
        animation.translate3d(ballInfo.left,ballInfo.top,0).opacity(opacity_normal).step();
        
        setData(that,{
            animation:animation.export()
        });
    },duration || 2000);

    
}

//获取小球的信息
function initBallInfo(){
    var systemInfo = wx.getSystemInfoSync();
    //注意：小程序是没有 clientWidth 和 clientHeight 属性的
    var windowWidth=systemInfo.clientWidth || systemInfo.windowWidth;
    var windowHeight=systemInfo.clientHeight ||  systemInfo.windowHeight;
    var ballWidth=ballHeight=64;
    
    //初始位置为右侧的中间
    var max_left=windowWidth-ballWidth;
    var max_top=windowHeight-ballHeight;
    var left=max_left,top=max_top/2;

    var strStoreDistance = wx.getStorageSync(storageKey);
    if(strStoreDistance){
        var arrStoreDistance = strStoreDistance.split(',');
        left =parseFloat(arrStoreDistance[0]);
        top = parseFloat(arrStoreDistance[1]);
    }

    //吸附左边缘或右边缘
    if(left>0 && left<max_left){
        if(left<max_left/2) left=0;
        else left=max_left;
    }

    
    

    if(left<0) left=0;
    if(top<0)top=0;
    if(left+ballWidth>windowWidth)left=max_left;
    if(top+ballHeight>windowHeight)top=max_top;

    ballInfo= {
      
        windowWidth:windowWidth,
        windowHeight:windowHeight,
        width:ballWidth,
        height:ballHeight,
        left:left,
        top:top
    };
}

//初始化
function init(that,opacity){
   
    initBallInfo();

    move(that,ballInfo.left,ballInfo.top,0,opacity);
}

// easeOutBounce算法
/*
*   t: current time（当前时间）；
    * b: beginning value（初始值）；
    * c: change in value（变化量）；
    * d: duration（持续时间）。
**/
function easeOutBounce(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    }
}

Component({

    externalClasses:['nb-icon','nb-icon-home'],

    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal, changedPath) {
                var that=this;
                if(newVal){

                    that.setData({ _show: newVal,opacity:0});

                    init(that,0);

                    setTimeout(function(){
                        that.setData({ opacity:opacity_active});

                        setTimeout(function(){
                            that.setData({ opacity:opacity_normal});
                        },2000);

                    },2000);
                   
                }
                else{
                    that.setData({ _show: newVal,opacity:0});
                }
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        animation:{},
        opacity:0,
        _show:false
    },

    //响应页面的生命周期
    pageLifetimes: {
        //响应屏幕变化
        resize:function(size) {
            init(this,opacity_normal);
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        goHome:function(){

            var path=NBConfig.home.path;
            if(typeof path=='function') path=path();

            wx.reLaunch({
                url:'/'+path
            })
        },
        onTouchStart:function(e){
            var that=this;
            if(!ballInfo)init(that);
  
            
            initBallInfo(that);

            var touch = e.touches[0] || e;

            startX = touch.pageX;
            startY = touch.pageY;

            flag_touching = true;

            flag_timerReady = true;

            if(timer_hide)clearTimeout(timer_hide);
           
        },
        onTouchMove:function(e){
           
            var that=this;

   
            
            if (flag_touching !== true) {
                return;
            }

            // 当移动开始的时候开始记录时间
            if (flag_timerReady == true) {
                ts_timerStart = +new Date();
                flag_timerReady = false;
            }


            var touch = e.touches[0] || e;

            nowX = touch.pageX;
            nowY = touch.pageY;

            var distanceX = nowX - startX,
                distanceY = nowY - startY;

            // 此时元素的位置
            var absLeft = ballInfo.left + distanceX,
                absTop = ballInfo.top + distanceY,
                absRight = absLeft + ballInfo.width,
                absBottom = absTop + ballInfo.height;

            // 边缘检测
            if (absLeft < 0) {
                distanceX = distanceX - absLeft;
            }
            if (absTop < 0) {
                distanceY = distanceY - absTop;
            }


            var windowWidth=ballInfo.windowWidth;
            var windowHeight=ballInfo.windowHeight;

            if (absRight > windowWidth) {
                distanceX = distanceX - (absRight - windowWidth);
            }
            if (absBottom > windowHeight) {
                distanceY = distanceY - (absBottom - windowHeight);
            }

            tempLeft=ballInfo.left+distanceX;
            tempTop=ballInfo.top+distanceY;

            move(that,tempLeft,tempTop);

            return false;
           
        },
        onTouchEnd:function(e){
            
            var that=this;

            if(flag_touching===false){
                return;
            }

            flag_touching=false;

            // 计算速度
            var ts_timerEnd = +new Date();

            if (!nowX || !nowY) {
                return;
            }

            ballInfo.left=tempLeft;
            ballInfo.top=tempTop;

            // 移动的水平和垂直距离
            var distanceX = nowX - startX,
                distanceY = nowY - startY;

            if (Math.abs(distanceX) < 5 && Math.abs(distanceY) < 5) {
                return;
            }

            // 距离和时间
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY), time = ts_timerEnd - ts_timerStart;

            // 速度，每一个自然刷新此时移动的距离
            var speed = distance / time * 16.666;

            // 经测试，2~60多px不等
            // 设置衰减速率
            // 数值越小，衰减越快
            var rate = Math.min(10, speed);

            // 开始惯性缓动
            flag_inertiaing = true;

            // 反弹的参数
            var reverseX = 1, reverseY = 1;

            var flag_reverse=true;//反弹开关
            var flag_edge=true;//吸附边缘

            var windowWidth=ballInfo.windowWidth;
            var windowHeight=ballInfo.windowHeight;

            // 速度计算法
            var step = function () {
                if (flag_touching == true) {
                    flag_inertiaing = false;
                    return;
                }

                // console.log(speed,speed - speed / rate);
                speed = speed - speed / rate;

               

                // 根据运动角度，分配给x, y方向
                var moveX = reverseX * speed * distanceX / distance, moveY = reverseY * speed * distanceY / distance;

                // 此时元素的各个数值
                ballInfo.right=ballInfo.left+ballInfo.width;
                ballInfo.bottom=ballInfo.top+ballInfo.height;
          
                if (moveX < 0 && ballInfo.left + moveX < 0) {
                    moveX = 0 - ballInfo.left;
                    // 碰触边缘方向反转
                    if(flag_reverse)reverseX = reverseX * -1;
                } else if (moveX > 0 && ballInfo.right + moveX > windowWidth) {
                    moveX = windowWidth - ballInfo.right;
                    if(flag_reverse)reverseX = reverseX * -1;
                }

                if (moveY < 0 && ballInfo.top + moveY < 0) {
                    moveY = -1 * ballInfo.top;
                    if(flag_reverse)reverseY = -1 * reverseY;
                } else if (moveY > 0 && ballInfo.bottom + moveY > windowHeight) {
                    moveY = windowHeight - ballInfo.bottom;
                    if(flag_reverse)reverseY = -1 * reverseY;
                }

                var x = ballInfo.left + moveX, y = ballInfo.top + moveY;
                // 位置变化
                move(that,x,y);

                ballInfo.left = x;
                ballInfo.top = y;

                if (speed < 0.1) {
                    speed = 0;
                    if (flag_edge == false) {
                        flag_inertiaing = false;

                        wx.setStorage({
                            key: storageKey,
                            data: [x,y].join(',')
                        });

                        moveFinish(that);
                    } else {
                        // 边缘吸附
                        edge();
                    }
                } else {
                    requestAnimationFrame(step);
                }
            };

            var edge = function () {
                // 时间
                var start = 0, during = 25;
                // 初始值和变化量
                var init = ballInfo.left, y = ballInfo.top, change = 0;
                // 判断元素现在在哪个半区
                // var bound = ele.getBoundingClientRect();
                if (ballInfo.left + ballInfo.width / 2 < windowWidth / 2) {
                    change = -1 * ballInfo.left;
                } else {
                    change = windowWidth - (ballInfo.left+ballInfo.width);
                }

                var run = function () {
                    // 如果用户触摸元素，停止继续动画
                    if (flag_touching == true) {
                        flag_inertiaing = false;
                        return;
                    }

                    start++;
                    var x = easeOutBounce(start, init, change, during);
                    move(that,x,y);

                    if (start < during) {
                        requestAnimationFrame(run);
                    } else {
                        ballInfo.left = x;
                        ballInfo.top = y;

                        flag_inertiaing = false;
                        wx.setStorage({
                            key: storageKey,
                            data: [x,y].join(',')
                        });
                        moveFinish(that);
                    }
                };
                run();
            };

            step();
           
        },
        onTransitionEnd:function(e){
            var that=this;
            if(!that.properties.show){
                setData(that,{_show:false})
            }
        },
       
      
    }
})