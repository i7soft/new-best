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
//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================


/*

使用方法：
var nbTouch = NBTouch(this,{
    width:100,  //组件的宽度，可通过 nbTouch.width 来赋值修改
    height:100, //组件的高度，可通过 nbTouch. height 来赋值修改
    drag:function(e){//拖放事件--能同时获得本次的 scale 与 rotate 值
        console.log(this,e.detail.x,e.detail.y);//this 是初始化时传入尽量的实例  this
    },
    pinch:function(e){//缩放事件
        console.log(this,e.detail.scale);
    },
    rotate:function(e){//旋转事件
        console.log(this,e.detail.rotate);
    }
});

然后在组件的相关触摸事件中触发 NBTouch 的触摸事件，分别是：
nbTouch.touchstart，nbTouch.touchmove，nbTouch.touchend，nbTouch.touchcancel

*/

var PINCH='pinch',DRAG='drag',ROTATE='rotate';
var math=Math;
function math_round(value){
    return math.round(value);
}

function getLength(v1) {
    return math.sqrt(v1.x * v1.x + v1.y * v1.y);
}

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
    // 通过数量积公式可以推导出：
    // cos = (x1 * x2 + y1 * y2)/(|a| * |b|);
    dot = v1.x * v2.x + v1.y * v2.y;
    r = dot / mr;
    if (r > 1) r = 1;
    if (r < -1) r = -1;
    // 解值并结合方向转化为角度值；
    return math.acos(r) * direction * 180 / math.PI;
}

function getBasePoint(that) {
    return {x:0,y:0};
    // var options=that.options;
    // var width=options.width;
    // var height=options.height;
    // var data=that.data;
    // var scale=data.scale;
    // return {
    //     x: width * scale / 2,
    //     y: height * scale / 2,
    // }
}

function getVector(p1, p2) {
    var x = math_round(p1.x - p2.x),
        y = math_round(p1.y - p2.y);
    return { x: x, y: y };
}

function getPoint(ev, index) {
    var touch=ev.touches[index];
    return {
        x: math_round(touch.clientX),
        y: math_round(touch.clientY)
    };
}

function include(str1, str2) {
    if (str1.indexOf) {
        return str1.indexOf(str2) !== -1;
    } else {
        return false;
    }
}

function doEvent(that,eventName,detail){
    var event=that.options[eventName];
    if(event && typeof event=='function')event.call(that.instance,detail);
}

function _bind(that) {
    that['touchstart']=_start.bind(that);
    that['touchmove']=_move.bind(that);
    that['touchend']=that['touchcancel']=_end.bind(that);
}

function getDistance(p1, p2) {
    var x = p2.x - p1.x,
        y = p2.y - p1.y;
    return math.sqrt((x * x) + (y * y));
}

function getLineCenter(p1,p2){
    var radio=0.5
    var x=(p2.x + p1.x)*radio;
    var y=(p2.y + p1.y)*radio;
    return {x:x,y:y}
}

//缩放的时候获得变换原点
function getLineOriginCenter(p1,p2,d1,d2){
    var x,y;
    var p1_x=p1.x,p1_y=p1.y;
    var p2_x=p2.x,p2_y=p2.y;

    var dd=d1+d2;
    var r_1=d1/dd;
    var r_2=d2/dd;

    if(p1_x<p2_x){
        x=p1_x+(p2_x-p1_x)*r_1;
    }
    else{
        x=p2_x+(p1_x-p2_x)*r_2;
    }

    if(p1_y<p2_y){
        y=p1_y+(p2_y-p1_y)*r_1;
    }
    else{
        y=p2_y+(p1_y-p2_y)*r_2;
    }

    return {
        x:x,
        y:y
    }
}

function _start (e) {
    var that=this;

    // 记录手指数量；
    that.fingers = e.touches.length;
    // 记录第一触控点；
    var startPoint=that.startPoint = getPoint(e, 0);
    // 计算单指操作时的基础点；
    that.singleBasePoint = getBasePoint(that);
    // 双指操作时
    if (that.fingers > 1) {
        // 第二触控点；
        var secondPoint=that.secondPoint = getPoint(e, 1);
        // 计算双指向量；
        that.vector1 = getVector(secondPoint, startPoint);
        // 计算向量模；
        that.pinchStartLength = getLength(that.vector1);

        that.start_fingersDistance=getDistance(startPoint,secondPoint);
    } 
}

function _move(ev) {
    var that=this;

    var curFingers = ev.touches.length,
        curPoint = getPoint(ev, 0),
        pinchLength = void 0;
    // 当从原先的两指到一指的时候，可能会出现基础手指的变化，导致跳动；
    // 因此需屏蔽掉一次错误的touchmove事件，待重新设置基础指后，再继续进行；
    if (curFingers < that.fingers) {
        that.startPoint = curPoint;
        that.fingers = curFingers;
        return;
    }

    var startPoint=that.startPoint;
    var secondPoint=that.secondPoint;

    // 两指先后触摸时，只会触发第一指一次 touchstart，第二指不会再次触发 touchstart；
    // 因此会出现没有记录第二指状态，需要在touchmove中重新获取参数；
    if (curFingers > 1 && (!that.secondPoint || !that.vector1 || !that.pinchStartLength)) {
        that.secondPoint = getPoint(ev, 1);
        that.vector1 = getVector(secondPoint, startPoint);
        that.pinchStartLength = getLength(that.vector1);
    }
    var now_originCenter=curPoint;
    var start_originCenter=startPoint;
    // 双指时，需触发 pinch 和 rotate 事件；
    if (curFingers > 1) {
        var curSecPoint = getPoint(ev, 1),
            vector2 = getVector(curSecPoint, curPoint);

            var now_fingersDistance=getDistance(curPoint,curSecPoint);
            var fingerDistance1=getDistance(startPoint,curPoint);
            var fingerDistance2=getDistance(secondPoint,curSecPoint);
            now_originCenter=getLineOriginCenter(curPoint,curSecPoint,fingerDistance1,fingerDistance2);
            start_originCenter=getLineCenter(startPoint,secondPoint);

            // console.log(now_originCenter);

        // 触发 pinch 事件；
        pinchLength = getLength(vector2);
        _eventFire(that,PINCH, {
            delta: {
                scale: pinchLength / that.pinchStartLength
            },
            origin: ev
        });
        that.pinchStartLength = pinchLength;
        
        // 触发 rotate 事件；
        _eventFire(that,ROTATE, {
            delta: {
                rotate: getAngle(that.vector1, vector2)
            },
            origin: ev
        });
        that.vector1 = vector2;
        
    } 
    
    // 触发 drag 事件；
    that.startOriginCenter=start_originCenter;
    that.endOriginCenter=now_originCenter;
    // console.log(curPoint.y - startPoint.y,now_originCenter.y - start_originCenter.y);
      
    _eventFire(that,DRAG, {
        delta: {
            deltaX: curPoint.x - startPoint.x,
            deltaY: curPoint.y - startPoint.y
        },
        origin: ev
    });
       
    
    that.startPoint = curPoint;

    return false;
}

function _end(ev) {
    var that = this;

    // 触发 end 事件；
    [PINCH, DRAG, ROTATE].forEach(function (evName) {
        _eventEnd(that,evName, { origin: ev });
    });
}

function _eventFire(that,evName, ev) {
    var ing = evName + 'ing',
        start = evName + 'Start';

    var data=that.data;
    var delta=ev.delta;
    if(include(evName,DRAG)){
        data.x += delta.deltaX;
        data.y += delta.deltaY;
        data.x2=data.x-that.endOriginCenter.x+that.startOriginCenter.x;
        data.y2=data.y-that.endOriginCenter.y+that.startOriginCenter.y;
        ev.detail=data;
    }
    else if(include(evName,PINCH)){
        data.scale *= delta.scale;
    }
    else if(include(evName,ROTATE)){
        data.rotate += delta.rotate
    }

    

    if (!that[ing]) {
        ev.eventType = start;
        doEvent(that,start,ev);
        that[ing] = true;
    } else {
        ev.eventType = evName;
        doEvent(that,evName,ev);
    }
}

function _eventEnd(that,evName, ev) {
    var ing = evName + 'ing',
        end = void 0;
    if (evName == ROTATE) {
        end = evName + 'nd';
    } else {
        end = evName + 'End';
    }
    if (that[ing]) {
        ev.eventType = end;
        doEvent(that,end,ev);
        that[ing] = false;
    }
};

function NbTouch(instance,options) {
    
    // 兼容不使用 new 的方式；
    if (!(this instanceof NbTouch)) return new NbTouch(instance,options);

    var that=this;

    that.instance=instance;
    that.options=options;
 
    // 状态记录；
    that.draging = that.pinching = that.rotating = that.singlePinching = that.singleRotating = false;
    // 全局参数记录；
    that.fingers = 0;
    that.startScale = 1;
    that.startPoint = {};
    that.secondPoint = {};
    that.pinchStartLength = null;
    that.singlePinchStartLength = null;
    that.vector1 = {};
    that.singleBasePoint = {};

    that.data={
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0
    };

    _bind(that);
}

module.exports=NbTouch;