//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :Touch.js
//        description : 增强的 touch 事件。
//        
//        注意：touch.js 同时适用于基础组件 movable-view 与 movable-area，所以如果需要自定义，请同时检查以上两组件的相关功能。
//
//        特别感谢：郭东东(Tayde Guo) xd-tayde
//        他的 github 主页是：https://github.com/xd-tayde/mtouch
//        本页代码主要参考他的文章《HTML5中手势原理分析与数学知识的实践》：https://www.ctolib.com/topics-121630.html
//        以及他的 domo：http://f2er.meitu.com/gxd/mtouch/example/index.html
//        得力于他的研究与例子，本功能才能顺利完成，再次感谢！
//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================


/*

使用方法：

var nbTouch = NbTouch(this,{
    bindchange:function(e){
        console.log(this,e.detail);
    }
});

然后在组件的相关触摸事件中触发 NBTouch 的触摸事件，分别是：
nbTouch.touchstart，nbTouch.touchmove，nbTouch.touchend，nbTouch.touchcancel
如果需要支持鼠标拖放与缩放，还要增加：
nbTouch.mousedown，nbTouch.mousemove，nbTouch.mouseup，nbTouch.mousewheel
*/

//部分代码参考：
// 1、pinchzoom.js 插件
// 2、https://www.cnblogs.com/love314159/articles/9183398.html
// 3、http://f2er.meitu.com/gxd/mtouch/example/index.html

//默认配置参数
var defaults= {
    area:{
        el:null,//选择器字符串，如：#id，也可以是一个 element 对象。如果为 null，则需要自己处理好movableArea 的 width、height、left、top（可以直接 nbTouch.area.width=100）
        width:10,
        height:10,
        left:0,
        top:0
        // scaleArea:false//当里面的movable-view设置为支持双指缩放时，设置此值可将缩放手势生效区域修改为整个movable-area
    },
    view:{
        width:10,//实际宽度，不是缩放后的
        height:10,//实际高度，不是缩放后的
        offset:{//movable-view 有用部分相对于 movable- view 边框的偏移量
            x:0,
            y:0
        },
        scaleValue:1,//缩放倍数
        scaleMin:1,//最小缩放倍数
        scaleMax:2,//最大缩放倍数
        scaleMinBuffer:1,//缩放到最小的时候，还能继续缩小的倍数，但结束缩放时会回弹到 scaleMin
        scaleMaxBuffer:2,//缩放到最大的时候，还能继续放大的倍数，但结束缩放时会回弹到 scaleMax
        scaleDoubleTap:0,//双击放大的倍数，为 0 时不允许双击放大，值需在 scaleMin - scaleMax 之间
        direction:' none',//移动方向
        inertia:false,//是否有惯性
        inertiaReverse:false,//惯性滑动到边缘的时候，是否反弹
        lockDragAxis: false,//单次移动时是否限制只可以竖向运动或横向运动
        outOfBounds:false,//超过可移动区域后，是否还可以继续移动（结束拖放后会回弹到边界位置）
        outOfBoundsFriction:0.6,//超出边界后滑动的摩擦系统，取值范围是 0-1
        fixedInCenter:false,//当 movable-view 缩放后的高或宽小于 movable-area 的高或宽，则高或宽自动回到中间
        x:0,//位置，跟 offset 有区别
        y:0,
        damping:20,//阻尼系数，用于控制x或y改变时的动画和过界回弹的动画，值越大移动越快
        friction:2,//摩擦系数，用于控制惯性滑动的动画，值越大摩擦力越大，滑动越快停止；必须大于0，否则会被设置成默认值
        animation:true,//是否使用动画
        disabled:false,//是否禁用
        
    },
    animationDuration: 200,
    bindchange:null
};

var math=Math;

var VERTICAL='vertical',HORIZONTAL='horizontal',NONE='NONE';

var TouchStart='touchstart',TouchMove='touchmove',TouchEnd='touchend',TouchCancel='touchcancel',MouseDown='mousedown',MouseMove='mousemove',MouseUp='mouseup';




var requestAnimationFrame=wx.nextTick;


function isUndefined(value){
    return typeof value =='undefined'
}

function sum(a, b) {
    return a + b;
}

function math_round(value,count){
    count=count || 1;
    return math.round(value*count)/count;
}

function math_abs(value){
    return math.abs(value);
}

function math_sqrt(value){
    return math.sqrt(value);
}

function math_max(a, b){
    return math.max(a, b);
}

function math_min(a, b){
    return math.min(a, b);
}

function isCloseTo(value, expected) {
    return math_abs(value-expected)<2;
}

function getViewOptions(that){
    return that.view
}

function getAreaOptions(that){
    return that.area
}

//触发事件
function doEvent(that,eventName,detail){
    var eventName='bind'+eventName;
    var event=that.options[eventName];
    if(event && typeof event=='function')event.call(that.instance,detail);
}

//获得触摸坐标在元素上的位置，在 rn 的 pageX 即为 clientX
//在 react native 里面，默认是有locationX、locationY
function getLocation(movableArea,touch){

    var res_x=!isUndefined(touch.locationX)?touch.locationX:touch.clientX-movableArea.left;
    var res_y=!isUndefined(touch.locationY)?touch.locationY:touch.clientY-movableArea.top;

    return {
        x:res_x,
        y:res_y
    }
}

//获得向量长度
function getLength(v1) {
    return math.sqrt(v1.x * v1.x + v1.y * v1.y);
}

//获得两个向量的角度   
function getAngle(v1, v2) {
    // 判断方向，顺时针为 1 ,逆时针为 -1；
    var direction = v1.x * v2.y - v2.x * v1.y > 0 ? 1 : -1,

    // 两个向量的模；
        len1 = getLength(v1),
        len2 = getLength(v2),
        mr = len1 * len2,
        dot = void 0,
        r = void 0;
    if (mr === 0) return 0;
   
    dot = v1.x * v2.x + v1.y * v2.y;
    r = dot / mr;
    if (r > 1) r = 1;
    if (r < -1) r = -1;
    // 解值并结合方向转化为角度值；
    return math.acos(r) * direction * 180 / math.PI;
}

//获取 moveable-area 的尺寸和左上角坐标
function setMovableArea(that){
    var area=getAreaOptions(that);
    var el=that.el;
    if(el){
        if(el.getBoundingClientRect){
            var rect=el.getBoundingClientRect();
            area.left=rect.left;
            area.top=rect.top;
            area.width=rect.width;
            area.height=rect.height;
        }
        else if(el.boundingClientRect){
            //兼容小程序
            el.boundingClientRect(function(rect){
                area.left=rect.left;
                area.top=rect.top;
                area.width=rect.width;
                area.height=rect.height;
            }).exec()
        }
    }

}

//获取向量
function getVector(p1, p2) {
    var x = math_round(p1.x - p2.x),
        y = math_round(p1.y - p2.y);
    return { x: x, y: y };
}

function getTimestamp(){
    return +new Date();
}



//开始拖放
function handleDragStart(that,event) {

    stopAnimation(that);

    var touch = getTouches(that,event)[0];

    that.lastDragPosition = touch;
    that.hasInteraction = true;
    handleDrag(that,event);

    var event_detail=event.detail;

    that.posX = event_detail?event_detail.x:event.pageX;
    that.posY = event_detail?event_detail.y:event.pageY;

   
 
    that.timerready = true;
}

//拖放中
function handleDrag(that,event) {

    var touch = getTouches(that,event)[0];

    var view=getViewOptions(that);

    var changeSource='touch';

    var touch_x=touch.x,touch_y=touch.y;


    var outOfBoundsFriction=view.outOfBoundsFriction;
    if(outOfBoundsFriction<0 || outOfBoundsFriction>1)outOfBoundsFriction=0.6;
    //超出边界后拖动会有阻力
    
    var friction=1-outOfBoundsFriction;

    var lastDragPosition=that.lastDragPosition;
    

    var temp_offset=drag(that,touch, lastDragPosition,true);
    var temp_offset_x=temp_offset.x;
    var temp_offset_y=temp_offset.y;
    var boundary=getMoveBoundary(that);
    var boundary_min=boundary.min;
    var boundary_min_x=boundary_min.x;
    var boundary_min_y=boundary_min.y;
    var boundary_max=boundary.max;
    var boundary_max_x=boundary_max.x;
    var boundary_max_y=boundary_max.y;

    var isOut=false;

    var abs_value;
    if(temp_offset_x>boundary_max_x){//左边
        abs_value=temp_offset_x-boundary_max_x;
        touch_x=touch_x+abs_value-abs_value*friction;
        isOut=true;
    }
    if(temp_offset_y>boundary_max_y){//上边
        abs_value=temp_offset_y-boundary_max_y;
        touch_y=touch_y+abs_value-abs_value*friction;
        isOut=true;
    }

    if(temp_offset_x<boundary_min_x){//右边
        abs_value=boundary_min_x-temp_offset_x;
        touch_x=touch_x-abs_value+abs_value*friction;
        isOut=true;
    }
    if(temp_offset_y<boundary_min_y){//底边
        abs_value=boundary_min_y-temp_offset_y;
        touch_y=touch_y-abs_value+abs_value*friction;
        isOut=true;
    }

    if(isOut){
        touch.x=math_round(touch_x);
        touch.y=math_round(touch_y);
        changeSource='touch-out-of-bounds';

    }

    drag(that,touch, that.lastDragPosition);

    that.changeSource=changeSource;

    var event_type=event.type;
    
    that.offset =sanitizeOffset(that,that.offset,event_type=='touchmove' || event_type=='mousemove');

    that.lastDragPosition = touch;

    // 当移动开始的时候开始记录时间
    if (that.timerready == true) {
        that.timerstart = getTimestamp();
        that.timerready = false;
    }

    //用于拖放惯性
    var event_detail=event.detail;

    that.nowX = event_detail?event_detail.x:event.pageX;
    that.nowY = event_detail?event_detail.y:event.pageY;

}

//拖放结束
function handleDragEnd(that,event) {

    end(that,event);

    if(that.isOutOfBounds || !getViewOptions(that).inertia) return;


    if (that.singleTouching === false) {

        return;
    }
    that.singleTouching = false;

    // 计算速度
    that.timerend = getTimestamp();

    if (!that.nowX || !that.nowY) {
        return;
    }

    // 移动的水平和垂直距离
    var distanceX = that.nowX - that.posX,
    distanceY = that.nowY - that.posY;

    if (math_abs(distanceX) < 5 && math_abs(distanceY) < 5) {
        return;
    }

    // 距离和时间
    var distance = math_sqrt(distanceX * distanceX + distanceY * distanceY), time = that.timerend - that.timerstart;

    // 速度，每一个自然刷新此时移动的距离
    var speed = distance / time * 16.666;

    

    // 开始惯性缓动
    that.inertiaing = true;

    // 反弹的参数
    var reverseX = 1, reverseY = 1;


    // var options=that.options;
    var view=getViewOptions(that);

    
    var moveDirection=that.moveDirection;

    var flag_reverse=view.inertiaReverse;//反弹开关

    var boundary=getMoveBoundary(that);//console.log(boundary);
    var boundary_max=boundary.max;
    var boundary_min=boundary.min;


    var rate = view.friction;
    if(rate<=0)rate=2;

    rate=rate*5;

    
    var stop_top,stop_right,stop_bottom,stop_left;

    that.changeSource='friction';

    // 速度计算法
    var step = function () {


        that.inAnimation = true;

        if (that.singleTouching == true) {
            that.inertiaing = false;
            return;
        }
        speed = speed - speed / rate;

        // 根据运动角度，分配给x, y方向
        var moveX = math_round(reverseX * speed * distanceX / distance), 
        moveY = math_round(reverseY * speed * distanceY / distance);

        if(moveDirection==VERTICAL)moveX=0;
        else if(moveDirection==HORIZONTAL)moveX=0;
        else if(moveDirection==NONE){
            moveX=0;
            moveY=0;
            return;
        }
    
        var offset=that.offset;
        var offset_x=offset.x;
        var offset_y=offset.y;

        var lastDragPosition=that.lastDragPosition;


        if(moveX<0 && offset_x-moveX>=boundary_max.x){//越过最左边
            moveX=offset_x-boundary_max.x;
            if(stop_left) moveX=0;
            // 碰触边缘方向反转
            if(flag_reverse) reverseX = reverseX * -1;
            else{
                stop_left=true;
            }
        }
        else if (moveX > 0 && offset_x - moveX <= boundary_min.x) {//超过最右边
            moveX = offset_x-boundary_min.x;
            if(stop_right)moveX=0;
            if(flag_reverse)  reverseX = reverseX * -1;
            else{
                stop_right=true;
            }
        }
        
        if(moveY<=0 && offset_y-moveY>=boundary_max.y){//越过最上边
            // return;
            moveY=offset_y-boundary_max.y;
            if(stop_top) moveY=0;
            // 碰触边缘方向反转
            if(flag_reverse) reverseY = reverseY * -1;
            else{
                stop_top=true;
            }
        }
        else if (moveY > 0 && offset_y - moveY <= boundary_min.y) {//超过最下边
            moveY =offset_y-boundary_min.y;
            if(stop_bottom) moveY=0;
            if(flag_reverse)  reverseY = reverseY * -1;
            else{
                stop_bottom=true;
            }
        }

        if(!moveX && !moveY && !flag_reverse) {
            sanitizeOffsetAnimation(that);
            return;
        }

        var v_touch={
            x:math_round(moveX+lastDragPosition.x),
            y:math_round(moveY+lastDragPosition.y)
        };
    
        drag(that,v_touch,that.lastDragPosition);
        that.lastDragPosition = v_touch;
    
        update(that);

        if (speed < 0.1) {
            speed = 0;
            
            that.inertiaing = false;

            stopAnimation(that);

            sanitizeOffsetAnimation(that);

        } else {
            requestAnimationFrame(step);
        }
    };


    step();
}

//缩放开始
function handleZoomStart(that,event) {
    
    stopAnimation(that);
    that.lastScale = 1;
    that.nthZoom = 0;
    that.lastZoomCenter = false;
    that.hasInteraction = true;
}

//缩放中
function handleZoom(that,event, newScale) {
    var touchCenter = getTouchCenter(getTouches(that,event));
    var scaleValue = newScale / that.lastScale;

    that.changeSource='scale';

    that.lastScale = newScale;
    that.nthZoom += 1;

    if (that.nthZoom > 3) {
        scale(that,scaleValue, touchCenter,0,1);
        drag(that,touchCenter, that.lastZoomCenter);
    }
    that.lastZoomCenter = touchCenter;
}

//缩放结束
function handleZoomEnd(that) {
    end(that);
}

//限制缩放倍数在 scaleMin - scaleMax 之间
function fixScaleValue(that,value){
 
    var view=getViewOptions(that)

    var scaleMin=view.scaleMin;
    var scaleMax=view.scaleMax;

    value=math_max(scaleMin,value);
    value=math_min(scaleMax,value);

    return value;
}

//双击
function handleDoubleTap(that,event,targetScaleValue,targetOffset,changeSource,noAnimaiton) {

    var view=getViewOptions(that);

    var startZoomFactor = that.zoomFactor;

    var scaleDoubleTap=targetScaleValue || view.scaleDoubleTap;
    if(!scaleDoubleTap) return;

    var scaleMin=view.scaleMin;

    scaleDoubleTap=fixScaleValue(that,scaleDoubleTap);

    if(targetScaleValue){
        targetScaleValue=scaleDoubleTap;
        if(startZoomFactor==targetScaleValue) return;
    }

    // scaleMin=math_max(1,scaleMin);//缩小的时候最小为原来的 1 倍

    var center = getTouches(that,event)[0],
        zoomFactor =targetScaleValue || (math_round(that.zoomFactor,1000) > math_round(scaleMin,1000) ? scaleMin : scaleDoubleTap);

    that.changeSource=isUndefined(changeSource)?'scale':changeSource;

    if(noAnimaiton || !getViewOptions(that).animation){//不使用动画来移动
     
        scaleTo(that,zoomFactor, center,targetOffset);
        update(that);
        return;
    }


    var updateProgress = function(progress) {

 
        scaleTo(that,startZoomFactor + progress * (zoomFactor - startZoomFactor), center,targetOffset);

    };

    if (that.hasInteraction) {
        return;
    }


    //通过 damping 控制时间
    var animationDuration=math_abs(zoomFactor - startZoomFactor)/getViewOptions(that).damping*20000;


    animate(that,animationDuration, updateProgress, swing);
    
}

//获取可移动边界
function getMoveBoundary(that,buffer){
    

    var view=getViewOptions(that);
    var view_offset=view.offset;
    var area=getAreaOptions(that);
    var area_width=area.width;
    var area_height=area.height;
    var view_width=view.width;
    var view_height=view.height;
    var zoomFactor=that.zoomFactor;

    var outOfBounds=view.outOfBounds;//超过可移动区域后，是否还可以继续移动（结束拖放后会回弹到边界位置）

    

    var boundWidth=outOfBounds && buffer?view_width:0;
    var boundHeight=outOfBounds && buffer?view_height:0;


    var maxX =math_round(zoomFactor*(view_width+view_offset.x-boundWidth))-area_width,
        maxY = math_round(zoomFactor*(view_height+view_offset.y-boundHeight))-area_height,
        minX = math_round(zoomFactor*(view_offset.x+boundWidth)),
        minY = math_round(zoomFactor*(view_offset.y+boundHeight)),
        maxOffsetX = math_max(maxX, minX),
        maxOffsetY = math_max(maxY, minY),
        minOffsetX = math_min(maxX, minX),
        minOffsetY = math_min(maxY, minY);

    return {
        min:{
            x:minOffsetX,
            y:minOffsetY
        },
        max:{
            x:maxOffsetX,
            y:maxOffsetY
        }
    }
}

//计算可移动区域的边界-边界确认只在单指拖放和缩放放手后
function sanitizeOffset(that,offset,buffer,isEnd) {


    var boundary=getMoveBoundary(that,buffer);
  
    var min=boundary.min;
    var max=boundary.max;

    var res_x=math_min(math_max(offset.x, min.x), max.x);
    var res_y=math_min(math_max(offset.y, min.y), max.y);
 
    if(isEnd){
 
        var view=getViewOptions(that);
        var fixedInCenter=view.fixedInCenter;

        if(fixedInCenter){//回弹到中心


            var area=getAreaOptions(that);
            var area_width=area.width;
            var area_height=area.height;
            var view_offset=view.offset;
            var zoomFactor=that.zoomFactor;
            var view_width=math_round(zoomFactor*(view.width+view_offset.x*2));
            var view_height=math_round(zoomFactor*(view.height+view_offset.y*2));
        
            if(view_width<area_width){
                res_x=-math_round((area_width-view_width)/2)
            }
            if(view_height<area_height){
                res_y=-math_round((area_height-view_height)/2)
            }
        }
    }

    

    return {
        x: res_x,
        y: res_y
    };
}

function scaleTo(that,zoomFactor, center,targetOffset) {
    scale(that,zoomFactor / that.zoomFactor, center,targetOffset);
}

function scale(that,scaleValue, center,targetOffset,isScaling) {
    scaleValue = scaleZoomFactor(that,scaleValue);
    if(!targetOffset){


        
        targetOffset= addOffset(that,{
            x: (scaleValue - 1) * (center.x + that.offset.x),
            y: (scaleValue - 1) * (center.y + that.offset.y)
        },1);
    }

    that.offset= isScaling?targetOffset:sanitizeOffset(that,targetOffset,0,1);
}

function scaleZoomFactor(that,scaleValue) {

    var originalZoomFactor = that.zoomFactor;
    that.zoomFactor *= scaleValue;

    var view=getViewOptions(that);
    
    that.zoomFactor = math_min(view.scaleMaxBuffer, math_max(that.zoomFactor, view.scaleMinBuffer));
    return that.zoomFactor / originalZoomFactor;
}

function drag(that,center, lastCenter,justReturn) {


    var res;
    if (lastCenter) {
        var view=getViewOptions(that);
        var lockDragAxis=view.lockDragAxis;
        var direction=view.direction;
        if(direction==NONE) return;

        var res_x,res_y,moveDirection;

        if (lockDragAxis) {
            if (math_abs(center.x - lastCenter.x) > math_abs(center.y - lastCenter.y)) {
                res_x= -(center.x - lastCenter.x);
                res_y=0;
                
                moveDirection=HORIZONTAL;
            } else {
                res_x=0;
                res_y=-(center.y - lastCenter.y)
                
                moveDirection=VERTICAL;
            }
        } else {

            res_x=-(center.x - lastCenter.x);
            res_y=-(center.y - lastCenter.y);

            moveDirection='all';

            if(direction==HORIZONTAL){
                res_y=0;
                moveDirection=HORIZONTAL;
            }
            if(direction==VERTICAL){
                res_x=0;
                moveDirection=VERTICAL;
            }

            
        }

        res=addOffset(that,{
            x: res_x,
            y: res_y
        },justReturn);

        that.moveDirection=moveDirection;
    }
    return res;
}

function getTouchCenter(touches) {
    return getVectorAvg(touches);
}

function getVectorAvg(vectors) {
    return {
        x: math_round(vectors.map(function(v) {
            return v.x;
        }).reduce(sum) / vectors.length),
        y: math_round(vectors.map(function(v) {
            return v.y;
        }).reduce(sum) / vectors.length)
    };
}

function addOffset(that,offset,justReturn) {
    var prev_offset=that.offset;
    var res={
        x: math_round(prev_offset.x + offset.x),
        y: math_round(prev_offset.y + offset.y)
    };
    if(justReturn) return res;
    that.offset = res;
}

function sanitize(that) {

    var view=getViewOptions(that);

    that.isOutOfBounds=false;



    if (that.zoomFactor < view.scaleMin) {
        zoomOutAnimation(that);
    } else if (that.zoomFactor > view.scaleMax) {
        zoomInAnimation(that);
    } else if (isInsaneOffset(that,that.offset)) {
        that.isOutOfBounds=true;
        sanitizeOffsetAnimation(that);
    }

}

function isInsaneOffset(that,offset) {
    var sanitizedOffset = sanitizeOffset(that,offset);
    return sanitizedOffset.x !== offset.x || sanitizedOffset.y !== offset.y;
}

function sanitizeOffsetAnimation(that,targetOffset,changeSource,noAnimaiton) {
    var offset=that.offset;
    targetOffset= sanitizeOffset(that,targetOffset || that.offset,0,1);

    that.changeSource=isUndefined(changeSource)? 'out-of-bounds':'';

    var animation=getViewOptions(that).animation;
    if(!animation){//不使用动画
        that.offset=targetOffset;
        return;
    }

    if(noAnimaiton || !getViewOptions(that).animation){//不使用动画来移动
        that.offset=targetOffset;
        update(that);
        return;
    }

    var startOffset = {
        x: offset.x,
        y: offset.y
    };



    var updateProgress = function(progress) {
        that.offset.x = startOffset.x + progress * (targetOffset.x - startOffset.x);
        that.offset.y = startOffset.y + progress * (targetOffset.y - startOffset.y);
        update(that);
    };

    //通过 damping 控制时间
    var animationDuration=math_max(math_abs(targetOffset.x-startOffset.x),math_abs(targetOffset.y-startOffset.y))/getViewOptions(that).damping*200;


    animate(that,animationDuration, updateProgress, swing);
}

//当缩放倍数比 scaleMin 小的时候回弹
function zoomOutAnimation(that,callback) {
    
    var startZoomFactor = that.zoomFactor,
        zoomFactor = getViewOptions(that).scaleMin,
        center = that.lastZoomCenter ||getCurrentZoomCenter(that);

 

    var updateProgress = function(progress) {

        scaleTo(that,startZoomFactor + progress * (zoomFactor - startZoomFactor), center);

    };

    animate(that,that.options.animationDuration, updateProgress, swing,function(){  
        callback && callback();
    });
}

//当缩放倍数比 scaleMax 大的是回弹
function zoomInAnimation(that,callback) {
    
    var startZoomFactor = that.zoomFactor,
        zoomFactor = getViewOptions(that).scaleMax,
        center = that.lastZoomCenter ||getCurrentZoomCenter(that);



    var updateProgress = function(progress) {
        
        scaleTo(that,startZoomFactor + progress * (zoomFactor - startZoomFactor), center);

    };

    animate(that,that.options.animationDuration, updateProgress, swing,function(){
            
        callback && callback();
    });
}

//获得缩放中心
function getCurrentZoomCenter(that) {

    // var options=that.options;
    var area=getAreaOptions(that);
    var my_width=area.width;
    var my_height=area.height;

    var zoomFactor=that.zoomFactor;
    var offset=that.offset;

    var length = my_width * zoomFactor,
        offsetLeft = offset.x,
        offsetRight = length - offsetLeft - my_width,
        widthOffsetRatio = offsetLeft / offsetRight,
        centerX = widthOffsetRatio * my_width / (widthOffsetRatio + 1),
        height = my_height * zoomFactor,
        offsetTop = offset.y,
        offsetBottom = height - offsetTop - my_height,
        heightOffsetRatio = offsetTop / offsetBottom,
        centerY = heightOffsetRatio * my_height / (heightOffsetRatio + 1);

    if (offsetRight === 0) {
        centerX = my_width;
    }
    if (offsetBottom === 0) {
        centerY = my_height;
    }


    return {
        x: centerX,
        y: centerY
    };
}


function canDrag(that) {
    return true;
}

//获得事件坐标相对于容器元素的坐标
function getTouches(that,event) {


    var area=getAreaOptions(that);

    return Array.prototype.slice.call(event.touches).map(function(touch) {
        return getLocation(area,touch);
    });
}

var ts_animation=0;
function animate(that,duration, framefn, timefn, callback) {
    var startTime = ts_animation= getTimestamp();
    var renderFrame = function() {
        
        if (!that.inAnimation || ts_animation!=startTime) {
            return;
        }
        var frameTime =  getTimestamp()- startTime
            , progress = frameTime / duration;
        if (frameTime >= duration) {
            framefn(1);
            stopAnimation(that);
            update(that);
            if (callback) {
                callback();
            }
            update(that);
            
        } else {
            if (timefn) {
                progress = timefn(progress);
            }
            framefn(progress);
            update(that);
            requestAnimationFrame(renderFrame);
        }
    };
    that.inAnimation = true;
    requestAnimationFrame(renderFrame);
}

function stopAnimation(that) {
    that.inAnimation = false;
    ts_animation=0;
}

function swing(p) {
    return -math.cos(p * math.PI) / 2 + 0.5;
}

function end(that,event) {
    
    that.hasInteraction = false;

    
    sanitize(that,true);
    update(that);
}

function bindEvents(that) {
    detectGestures(that);
}

function update(that) {

    
    var offset=that.offset;

    var zoomFactor = math_round(that.zoomFactor,1000);
    var offsetX = math_round(-offset.x / zoomFactor)
    var offsetY = math_round(-offset.y / zoomFactor);

    var rotateValue=math_round(that.rotate ||0);


    doEvent(that,'change',{
        detail:{
            x:offsetX,
            y:offsetY,
            scale:zoomFactor,
            rotate:rotateValue,
            source:that.changeSource,
            data:that.data
        }
    })
            
}

function init(that){
    var view=getViewOptions(that);
    var scaleValue=fixScaleValue(that,view.scaleValue);
    var view_offset=view.offset;
    var x=view.x;
    var y=view.y;
    var offset={
        x:-x+view_offset.x,
        y:-y+view_offset.y
    };
    that.offset=sanitizeOffset(that,offset);
    that.lastScale=scaleValue;
    that.zoomFactor=scaleValue;
}

function saveEventData(e){
    return {
        clientX:e.clientX,
        clientY:e.clientY,
        pageX:e.pageX,
        pageY:e.pageY
    }
}

var detectGestures = function( target) {
    var that=target;
    var interaction = null,
        fingers = 0,
        lastTouchStart = null,
        startTouches = null,
        setInteraction = function(newInteraction, event) {
            if (interaction !== newInteraction) {
                if (interaction && !newInteraction) {
                    switch (interaction) {
                        case "zoom":
                            handleZoomEnd(that,event);
                            break;
                        case 'drag':
                            handleDragEnd(that,event);
                            break;
                    }
                }
                switch (newInteraction) {
                    case 'zoom':
                        handleZoomStart(that,event);
                        break;
                    case 'drag':
                        handleDragStart(that,event);
                        break;
                }
            }
            interaction = newInteraction;
        }, 
        updateInteraction = function(event) {
            if (fingers === 2) {
                
                setInteraction('zoom');
            } else if (fingers === 1 && canDrag(that)) {
                setInteraction('drag', event);
            } else {
                setInteraction(null, event);
            }
        },
        targetTouches = function(touches) {
            return Array.prototype.slice.call(touches).map(function(touch) {
                return {
                    x: touch.pageX,
                    y: touch.pageY
                };
            });
        },
        getDistance = function(a, b) {
            var x, y;
            x = a.x - b.x;
            y = a.y - b.y;
            return math_sqrt(x * x + y * y);
        },
        calculateScale = function(startTouches, endTouches) {
            var startDistance = getDistance(startTouches[0], startTouches[1])
            , endDistance = getDistance(endTouches[0], endTouches[1]);
            return endDistance / startDistance;
        },
        cancelEvent = function(event) {
            if(event.stopPropagation){
                event.stopPropagation();
                event.preventDefault();
            }
            
        },
        detectDoubleTap = function(event) {
            var time = getTimestamp();
            if (fingers > 1) {
                lastTouchStart = null;
            }
            if (time - lastTouchStart < 300) {
                cancelEvent(event);
                handleDoubleTap(that,event);
       
                switch (interaction) {
                    case "zoom":
                        handleZoomEnd(that,event);
                        break;
                    case 'drag':
                        handleDragEnd(that,event);
                        break;
                }
            }
            if (fingers === 1) {
                lastTouchStart = time;
            }
        }, 
        firstMove = true;

    var last_event;

    that[TouchStart]=that[MouseDown]=function(event) {

        var event_type=event.type;

        
        if(event_type==TouchStart){
            
            target.isTouchEvent=true;
        }

        if(event_type==MouseDown){
            if(target.isTouchEvent) return;//如果响应了 touch 事件，则不响应 mouse 事件

            //重置 touch 结束状态
            target.isTouchEvent=false;

            //开始可以响应下面的 mousemove 事件
            target.isMouseDown=true;

            last_event=saveEventData(event);
        } 


        if (!getViewOptions(target).disabled) {

            var touches=event.touches;
            if(!touches){
                touches=event.touches=[event];
            }

            setMovableArea(this);
            firstMove = true;
            fingers = touches.length;
            detectDoubleTap(event);

            target.singleTouching=touches.length==1;

            if(touches.length==2){
                var touch1=touches[0];
                var touch2=touches[1];
                that.startVector=getVector({
                    x:touch1.clientX,
                    y:touch1.clientY
                },{
                    x:touch2.clientX,
                    y:touch2.clientY
                })
            }
        
        }
    };

    
    
    that[TouchMove]=that[MouseMove]=function(event) {

        var event_type=event.type;
    
        if(event_type==MouseMove && (target.isTouchEvent || !target.isMouseDown)) return;//如果响应了 touch 事件，则不响应 mouse 事件；没有先开始 mousedown 也不响应 mousemove

        last_event=saveEventData(event);

        //如果移动的 clientX 和 clientY 超出了可视访问，则模拟触发 mouseup 事件
        

        if (!getViewOptions(target).disabled) {

            var touches=event.touches;
            if(!touches){
                touches=event.touches=[event];
            }

            if (firstMove) {
                updateInteraction(event);
                if (interaction) {
                    cancelEvent(event);
                }
                startTouches = targetTouches(touches);
            } else {
                switch (interaction) {
                    case 'zoom':
                        handleZoom(that,event, calculateScale(startTouches, targetTouches(touches)));
                        break;
                    case 'drag':
                        handleDrag(that,event);
                        break;
                }
                if (interaction) {
                    cancelEvent(event);
                    update(that);
                }
            }
            firstMove = false;

            if(touches.length==2){
                var touch1=touches[0];
                var touch2=touches[1];
                var nowVector=getVector({
                    x:touch1.clientX,
                    y:touch1.clientY
                },{
                    x:touch2.clientX,
                    y:touch2.clientY
                });
                target.rotate=getAngle(that.startVector, nowVector);
            }
        }
    };

    
    
    that[TouchEnd]=that[TouchCancel]=that[MouseUp]=function(event) {

        var event_type=event.type;
        

        if(event_type==MouseUp && target.isMouseDown){
            if(target.isTouchEvent) return;//如果响应了 touch 事件，则不响应 mouse 事件

            //重置 touch 结束状态
            target.isTouchEvent=false;

            target.isMouseDown=false;
        } 



        if (!getViewOptions(target).disabled) {
            var touches=event.touches;
            if(!touches){
                touches=event.touches=[];
            }
            fingers =touches.length;
            updateInteraction(event);
        }
    };

    //需要订阅 window.onblur 事件，或在 page 的 onBlur 事件中触发此处理函数
    that.onblur=function(){
        if(target.isMouseDown){
            //模拟鼠标放开事件
            that[MouseUp]({
                type:MouseUp,
                touches:[last_event]
            })
        }
    };

    //鼠标滚轮缩放
    that.mousewheel=function(event){
        // console.log(event)

        var delta=event.wheelDeltaY || event.wheelDelta;

        delta=delta/600;
        event.touches=[event];

        var scaleValue = fixScaleValue(that,that.zoomFactor+delta);


        stopAnimation(that);

        handleDoubleTap(that,event,scaleValue);

    };
};

var NbTouch = function(instance, options,data) {
    var that=this;
  
    that.zoomFactor = 1;
    that.lastScale = 1;
    that.instance=instance;
    that.data=data;

    that.offset = {
        x: 0,
        y: 0
    };
    var temp_options={};

    for(var x in defaults){
        if(x=='area'||x=='view'){
            if(isUndefined(temp_options[x]))temp_options[x]={};
            for(var y in defaults[x]){
                temp_options[x][y]=isUndefined(options[x][y])?defaults[x][y]:options[x][y];
            }
        }
        else{
            temp_options[x]=isUndefined(options[x])? defaults[x]:options[x];
        }
    }

    that.options=temp_options;

    that.area=temp_options.area;
    that.el =that.area.el;
    that.view=temp_options.view;

    that.changeSource='init';
    init(that);
    setMovableArea(that);
    bindEvents(that);
    update(that);
    
    that.enabled=true;
};

NbTouch.prototype = { 
    //修改位置或缩放倍数，或者同时修改二者
    setValue:function(x,y,scaleValue,noAnimaiton){

        var that=this;

        var changeSource='';

        var view=getViewOptions(that);
        var view_offset=view.offset;
        var zoomFactor=math_round(that.zoomFactor,1000);
        var view_width=zoomFactor*(view.width+view_offset.x*2);
        var view_height=zoomFactor*(view.height+view_offset.y*2);

        var offset=that.offset;

        var center={
            locationX:math_round(view_width/2-offset.x),
            locationY:math_round(view_height/2-offset.y)
        };

        var targetOffset;

        if(!isUndefined(x) && !isUndefined(y)){
            targetOffset={
                x:-x+view_offset.x,
                y:-y+view_offset.y
            };
        }
      
        if(isUndefined(scaleValue) || math_round(scaleValue,1000)==zoomFactor){
            if(targetOffset) sanitizeOffsetAnimation(that,targetOffset,changeSource,noAnimaiton)
        }
        else{
            handleDoubleTap(that,{
                touches:[center]
            },fixScaleValue(that,scaleValue),targetOffset,changeSource,noAnimaiton);
        }
    },
    //强制更新
    forceUpdate:function(){
        update(this);
    },
    //检查 movable-view 四边分别是否在 movable-area 的边缘上
    getState:function(){
        var that=this;
        var offset=that.offset;
        var offset_x=offset.x;
        var offset_y=offset.y;

        var boundary=getMoveBoundary(that);

        var min=boundary.min;
        var max=boundary.max;

        // console.log(boundary,offset);

        return {
            top:isCloseTo(offset_y,min.y),//是否贴紧上边
            right:isCloseTo(offset_x,max.x),//是否贴紧右边
            bottom:isCloseTo(offset_y,max.y),//是否贴紧下边
            left:isCloseTo(offset_x,min.x),//是否贴紧左边
            scale:math_round(that.zoomFactor,1000)!=math_round(that.view.scaleValue,1000)//是否处于缩放状态
        }
        
    }
};




module.exports=NbTouch;