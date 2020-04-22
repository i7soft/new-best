(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';


function getLength(v1) {
        return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
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
        return Math.acos(r) * direction * 180 / Math.PI;
    }
    
    function getBasePoint(that) {
        var options=that.options;
        var width=options.width;
        var height=options.height;
        var data=that.data;
        return {
            x:width*data.scale/2,
            y:height*data.scale/2,
        }
        // if (!el) return { x: 0, y: 0 };
        // var offset = getOffset(el);
        // var x = offset.left + el.getBoundingClientRect().width / 2,
        //     y = offset.top + el.getBoundingClientRect().width / 2;
        // return { x: Math.round(x), y: Math.round(y) };
    }

    
    function getVector(p1, p2) {
        var x = Math.round(p1.x - p2.x),
            y = Math.round(p1.y - p2.y);
        return { x: x, y: y };
    }
    
    function getPoint(ev, index) {
        if (!ev || !ev.touches[index]) {
            // console.error('getPoint error!');
            return;
        }
        return {
            x: Math.round(ev.touches[index].pageX),
            y: Math.round(ev.touches[index].pageY)
        };
    }
    
    // function getOffset(el) {
    //     el = typeof el == 'string' ? document.querySelector(el) : el;
    //     var rect = el.getBoundingClientRect();
    //     var offset = {
    //         left: rect.left + document.body.scrollLeft,
    //         top: rect.top + document.body.scrollTop,
    //         width: el.offsetWidth,
    //         height: el.offsetHeight
    //     };
    //     return offset;
    // }
    
    // function matrixTo(matrix) {
    //     var arr = matrix.replace('matrix(', '').replace(')', '').split(',');
    //     var cos = arr[0],
    //         sin = arr[1],
    //         tan = sin / cos,
    //         rotate = Math.atan(tan) * 180 / Math.PI,
    //         scale = cos / Math.cos(Math.PI / 180 * rotate),
    //         trans = void 0;
    //     trans = {
    //         x: parseInt(arr[4]),
    //         y: parseInt(arr[5]),
    //         scale: scale,
    //         rotate: rotate
    //     };
    //     return trans;
    // }
    
    // function getUseName(evName) {
    //     var useName = evName.replace('start', '');
    //     var end = useName.indexOf('rotate') !== -1 ? 'nd' : 'end';
    //     useName = useName.replace(end, '');
    //     return useName;
    // }
    
    // function domify(DOMString) {
    //     var htmlDoc = document.implementation.createHTMLDocument();
    //     htmlDoc.body.innerHTML = DOMString;
    //     return htmlDoc.body.children;
    // }
    
    // function getEl(el) {
    //     var _el = void 0;
    //     if (typeof el == 'string') {
    //         _el = document.querySelector(el);
    //     } else if (el instanceof Node) {
    //         _el = el;
    //     } else {
    //         console.error('el error,there must be a el!');
    //         return;
    //     }
    //     return _el;
    // }
    
    // function data(el, key) {
    //     el = getEl(el);
    //     return el.getAttribute('data-' + key);
    // }
    
    function include(str1, str2) {
        if (str1.indexOf) {
            return str1.indexOf(str2) !== -1;
        } else {
            return false;
        }
    }
    
    // function getPos(el) {
    //     if (!el) return;
    //     el = getEl(el);
    //     var defaulTrans = void 0;
    //     var style = window.getComputedStyle(el, null);
    //     var cssTrans = style.transform || style.webkitTransform;

    //     if (window.getComputedStyle && cssTrans !== 'none') {
    //         defaulTrans = matrixTo(cssTrans);
    //     } else {
    //         defaulTrans = {
    //             x: 0,
    //             y: 0,
    //             scale: 1,
    //             rotate: 0
    //         };
    //     }
    //     return JSON.parse(el.getAttribute('data-mtouch-status')) || defaulTrans;
    // }
    


// var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// var HandlerBus = function () {
//     function HandlerBus(el) {
//         _classCallCheck(this, HandlerBus);

//         this.handlers = [];
//         this.el = el;
//     }

//     _createClass(HandlerBus, [{
//         key: 'add',
//         value: function add(handler) {
//             this.handlers.push(handler);
//             return this;
//         }
//     }, {
//         key: 'del',
//         value: function del(handler) {
//             var _this = this;

//             if (!handler) {
//                 this.handlers = [];
//             } else {
//                 this.handlers.forEach(function (value, index) {
//                     if (value === handler) {
//                         _this.handlers.splice(index, 1);
//                     }
//                 });
//             }
//             return this;
//         }
//     }, {
//         key: 'fire',
//         value: function fire() {
//             var _this2 = this,
//                 _arguments = arguments;

//             if (!this.handlers || !this.handlers.length === 0) return;
//             this.handlers.forEach(function (handler) {
//                 if (typeof handler === 'function') handler.apply(_this2.el, _arguments);
//             });
//             return this;
//         }
//     }]);

//     return HandlerBus;
// }();

// var EVENT = ['touchstart', 'touchmove', 'touchend', 'drag', 'dragstart', 'dragend', 'pinch', 'pinchstart', 'pinchend', 'rotate', 'rotatestart', 'rotatend', 'singlePinchstart', 'singlePinch', 'singlePinchend', 'singleRotate', 'singleRotatestart', 'singleRotatend'];

// var ORIGINEVENT = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];



function MTouch(instance,options) {
    // var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    
    // 兼容不使用 new 的方式；
    if (!(this instanceof MTouch)) return new MTouch(instance,options);

    var that=this;
    // 开关；
    // 初始化时关闭，在调用 on 函数时对应开启；
    var use=that.use = {
        drag: false,
        pinch: false,
        rotate: false,
        singlePinch: false,
        singleRotate: false
    };
    // 获取容器元素；
    // that.operator = that.el = getEl(el);
    //事件回调的实例
    that.instance=instance;
    that.options=options;
    if(options){
        for(var x in use){
            for(var y in options){
                if(y.indexOf(x)==0){
                    use[y]=true;
                    break;
                }
            }
        }
    }
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

    // 插入css;
    // this._css();
    // 初始化注册事件队列；
    // this._driveBus();
    // 监听原生 touch 事件；
    _bind(that);

 
    // return that;
}

function doEvent(that,eventName,detail){
    var event=that.options[eventName];
    if(event && typeof event=='function')event.call(that.instance,detail);
}

// MTouch.prototype._driveBus = function () {
//     var _this = this;

//     EVENT.forEach(function (evName) {
//         _this[evName] = new HandlerBus(_this.el);
//     });
// };

function _bind(_this2) {
    // var _this2 = this;

    _this2['touchstart']=_start.bind(_this2);
    _this2['touchmove']=_move.bind(_this2);
    _this2['touchend']=_this2['touchcancel']=_end.bind(_this2);
    // ORIGINEVENT.forEach(function (evName) {
    //     var fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
    //     // 需要存下 bind(this) 后的函数指向，用于 destroy;
    //     // _this2['_' + fn + '_bind'] = _this2['_' + fn].bind(_this2);
    //     // _this2.el.addEventListener(evName, _this2['_' + fn + '_bind'], false);
    //     _this2[evName]=_this2['_' + fn].bind(_this2)
    // });
};
// MTouch.prototype.destroy = function () {
//     var _this3 = this;

//     ORIGINEVENT.forEach(function (evName) {
//         var fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
//         _this3.el.removeEventListener(evName, _this3['_' + fn + '_bind'], false);
//     });
// };
function _start (e) {
    var that=this;
    var use=that.use;
    // if (!e.touches || e.type !== 'touchstart') return;
    // 记录手指数量；
    that.fingers = e.touches.length;
    // 记录第一触控点；
    that.startPoint = getPoint(e, 0);
    // 计算单指操作时的基础点；
    that.singleBasePoint = getBasePoint(that);
    // 双指操作时
    if (that.fingers > 1) {
        // 第二触控点；
        that.secondPoint = getPoint(e, 1);
        // 计算双指向量；
        that.vector1 = getVector(that.secondPoint, that.startPoint);
        // 计算向量模；
        that.pinchStartLength = getLength(that.vector1);
    } else if (use.singlePinch) {
        // 单指且监听 singlePinch 时，计算向量模；
        var pinchV1 = getVector(that.startPoint, that.singleBasePoint);
        that.singlePinchStartLength = getLength(pinchV1);
    }
    // 触发 touchstart 事件；
    // that.touchstart.fire({ origin: e, eventType: 'touchstart' });
};
function _move(ev) {
    var that=this;
    var use=that.use;
    // if (!ev.touches || ev.type !== 'touchmove') return;
    // 判断触控点是否为 singlebutton 区域；
    // var isSingleButton = false,//data(ev.target, 'singleButton'),
    var curFingers = ev.touches.length,
        curPoint = getPoint(ev, 0),
        // singlePinchLength = void 0,
        pinchLength = void 0;
        // rotateV1 = void 0,
        // rotateV2 = void 0,
        // pinchV2 = void 0;
    // 当从原先的两指到一指的时候，可能会出现基础手指的变化，导致跳动；
    // 因此需屏蔽掉一次错误的touchmove事件，待重新设置基础指后，再继续进行；
    if (curFingers < that.fingers) {
        that.startPoint = curPoint;
        that.fingers = curFingers;
        return;
    }
    // 两指先后触摸时，只会触发第一指一次 touchstart，第二指不会再次触发 touchstart；
    // 因此会出现没有记录第二指状态，需要在touchmove中重新获取参数；
    if (curFingers > 1 && (!that.secondPoint || !that.vector1 || !that.pinchStartLength)) {
        that.secondPoint = getPoint(ev, 1);
        that.vector1 = getVector(that.secondPoint, that.startPoint);
        that.pinchStartLength = getLength(that.vector1);
    }
    // 双指时，需触发 pinch 和 rotate 事件；
    if (curFingers > 1) {
        var curSecPoint = getPoint(ev, 1),
            vector2 = getVector(curSecPoint, curPoint);
        // 触发 pinch 事件；
        if (use.pinch) {
            pinchLength = getLength(vector2);
            _eventFire(that,'pinch', {
                delta: {
                    scale: pinchLength / that.pinchStartLength
                },
                origin: ev
            });
            that.pinchStartLength = pinchLength;
        }
        // 触发 rotate 事件；
        if (use.rotate) {
            _eventFire(that,'rotate', {
                delta: {
                    rotate: getAngle(that.vector1, vector2)
                },
                origin: ev
            });
            that.vector1 = vector2;
        }
    } 
    // else {
    //     // 触发 singlePinch 事件;
    //     if (use.singlePinch && isSingleButton) {
    //         pinchV2 = getVector(curPoint, that.singleBasePoint);
    //         singlePinchLength = getLength(pinchV2);
    //         _eventFire(that,'singlePinch', {
    //             delta: {
    //                 scale: singlePinchLength / that.singlePinchStartLength,
    //                 deltaX: curPoint.x - that.startPoint.x,
    //                 deltaY: curPoint.y - that.startPoint.y
    //             },
    //             origin: ev
    //         });
    //         that.singlePinchStartLength = singlePinchLength;
    //     }
    //     // 触发 singleRotate 事件;
    //     if (use.singleRotate && isSingleButton) {
    //         rotateV1 = getVector(that.startPoint, that.singleBasePoint);
    //         rotateV2 = getVector(curPoint, that.singleBasePoint);
    //         _eventFire(that,'singleRotate', {
    //             delta: {
    //                 rotate: getAngle(rotateV1, rotateV2)
    //             },
    //             origin: ev
    //         });
    //     }
    // }
    // 触发 drag 事件；
    if (use.drag) {
        // if (!isSingleButton) {
            _eventFire(that,'drag', {
                delta: {
                    deltaX: curPoint.x - that.startPoint.x,
                    deltaY: curPoint.y - that.startPoint.y
                },
                origin: ev
            });
        // }
    }
    that.startPoint = curPoint;
    // 触发 touchmove 事件；
    // that.touchmove.fire({ eventType: 'touchmove', origin: ev });
    ev.preventDefault();
    return false;
};
function _end(ev) {
    var that = this;

    if (!ev.touches && ev.type !== 'touchend' && ev.type !== 'touchcancel') return;
    // 触发 end 事件；
    ['pinch', 'drag', 'rotate'].forEach(function (evName) {
        _eventEnd(that,evName, { origin: ev });
    });
    // this.touchend.fire({ eventType: 'touchend', origin: ev });
};
function _eventFire(that,evName, ev) {
    var ing = evName + 'ing',
        start = evName + 'Start';

    var data=that.data;
    var delta=ev.delta;
    if(include(evName,'drag')){
        data.x += delta.deltaX;
        data.y += delta.deltaY;
    }
    else if(include(evName,'pinch')){
        data.scale *= delta.scale;
    }
    else if(include(evName,'rotate')){
        data.rotate += delta.rotate
    }

    ev.detail=data;

    if (!that[ing]) {
        ev.eventType = start;
        // this[start].fire(ev);
        doEvent(that,start,ev);
        that[ing] = true;
    } else {
        ev.eventType = evName;
        // this[evName].fire(ev);
        doEvent(that,evName,ev);
    }
};
function _eventEnd(that,evName, ev) {
    var ing = evName + 'ing',
        end = void 0;
    if (evName == 'rotate') {
        end = evName + 'nd';
    } else {
        end = evName + 'End';
    }
    if (that[ing]) {
        ev.eventType = end;
        // that[end].fire(ev);
        doEvent(that,end,ev);
        that[ing] = false;
    }
};
// 添加 button 区域；
// 背景样式由业务方定制；
// MTouch.prototype._addButton = function (el) {
//     var button = domify('<div class="mtouch-singleButton" data-singleButton=\'true\'></div>')[0];
//     el.appendChild(button);
//     el.setAttribute('data-mtouch-addButton', true);
// };
// 切换 operator;
// MTouch.prototype.switch = function (el) {
//     // var addButton = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

//     var _el = void 0;
//     if (!el) {
//         this.operator = this.el;
//         return;
//     }
//     this.operator = _el = getEl(el);
//     // if (!data(_el, 'mtouch-addButton') && (this.use.singleRotate || this.use.singlePinch) && addButton) {
//     //     this._addButton(_el);
//     // }
// };
// MTouch.prototype.on = function (evName) {
//     var _this5 = this;

//     var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
//     var operator = arguments[2];

//     if (include(evName, ' ')) {
//         evName.split(' ').forEach(function (v) {
//             _this5._on(v, handler, operator);
//         });
//     } else {
//         this._on(evName, handler, operator);
//     }
//     return this;
// };
// MTouch.prototype._on = function (evName, handler, operator) {
//     this.use[getUseName(evName)] = true;
//     this[evName].add(handler);
//     // this.switch(operator);
// };
// MTouch.prototype.off = function (evName, handler) {
//     this[evName].del(handler);
// };



window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();


// drag;
var dragTrans = {
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0
};
// var $drags = $('.js-drag-el');
var $drag = $('.b');
// var wrap = document.querySelector('.js-area');
// var wrapRect = wrap.getBoundingClientRect();
// var elRect = $drag[0].getBoundingClientRect();
// var freeze = false;
var mt = MTouch(this,{
    // getSize:function(){
    //     return {
    //         w:100*dragTrans.scale,
    //         h:100*dragTrans.scale
    //     }
    // },
    width:100,
    height:200,
    drag:function(ev){
        // dragTrans.x += ev.delta.deltaX;
        // dragTrans.y += ev.delta.deltaY;
        set($drag, ev.detail);
    },
    pinch:function(ev){
        // dragTrans.scale *= ev.delta.scale;
        set($drag, ev.detail);
    }
});
$drag.on('touchstart',mt.touchstart);
$drag.on('touchmove',mt.touchmove);
$drag.on('touchend',mt.touchend);
$drag.on('touchcancel',mt.touchcancel);
// mt.on('drag', function (ev) {
//     // if (!freeze) {
//         dragTrans.x += ev.delta.deltaX;
//         dragTrans.y += ev.delta.deltaY;
//         set($drag, dragTrans);
//     // }
// });

// mt.on('pinch singlePinch', function (ev) {
//     // if (!freeze) {
//         dragTrans.scale *= ev.delta.scale;
//         set($drag, dragTrans);
//     // }
// });
// mt.on('rotate singleRotate', function (ev) {
//     // if (!freeze) {
//         dragTrans.rotate += ev.delta.rotate;
//         set($drag, dragTrans);
//     // }
// });

// mt.switch('.b', true);

// $drags.on('click', function (e) {
//     freeze = false;
//     $drags.removeClass('active');
//     $(this).addClass('active');
//     dragTrans = getPos(this);
//     $drag = $(this);
//     mt.switch(this);
//     e.stopPropagation();
// });
// $(wrap).on('click', function () {
//     $drags.removeClass('active');
//     mt.switch(null);
//     freeze = true;
// });
// function limit(wrap, el, trans) {
//     var bounce = 40;
//     var minX = -el.offsetLeft - bounce;
//     var maxX = wrapRect.width - el.offsetLeft - elRect.width + bounce;
//     var minY = -el.offsetTop - bounce;
//     var maxY = wrapRect.height - el.offsetTop - elRect.height + bounce;
//     trans.x = trans.x < minX ? minX : trans.x;
//     trans.x = trans.x > maxX ? maxX : trans.x;
//     trans.y = trans.y < minY ? minY : trans.y;
//     trans.y = trans.y > maxY ? maxY : trans.y;
//     return trans;
// }


function set($el, transform) {
    window.requestAnimFrame(function () {
        $el.css('transform', 'scale(' + transform.scale + ') translate3d(' + transform.x + 'px,' + transform.y + 'px,0px) rotate(' + transform.rotate + 'deg)');
    });
}



})));
//# sourceMappingURL=example.js.map
