//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :keyboard.js
//        description : 自定义 input 组件的键盘。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');
var Px=require('./utils/Px');
var keyboard_height=Px('500rpx');//键盘高度
var animation_duration=250;//键盘打开与关闭的动画时长
var detail_will={duration:animation_duration,height:keyboard_height};
var detail_did={duration:0,height:keyboard_height};
var slideUp='nb-animate-slide-up',slideDown='nb-animate-slide-down';

function setData(that,data){
    that.setData(data);
}

function triggerEvent(that,eventName,options){
    that.triggerEvent(eventName,options);
}

Component({

    externalClasses:["nb-icon","nb-icon-close-keyboard","nb-icon-backspace",slideUp,slideDown],

    /**
     * 组件的属性列表
     */
    properties: {
       
        confirmType:{
            type: String,
            value:'Done',
            observer: function (newVal) {
                setData(this,{ _confirmType:L(newVal.substr(0,1).toUpperCase()+newVal.substr(1))});
            }
        },
        type:{
            type: String,
            value:'',
            observer: function (newVal) {
                setData(this,{_type:newVal});
            }
        },
        show: {
            type: Number,
            value: 0,
            observer: function (newVal,oldVal) {
                var that=this;
                if(newVal){
                    triggerEvent(that,'keyboardWillShow', detail_will);
                    if(!oldVal){// oldVal 为第一次打开，其他情况是键盘需要强制刷新状态
                        that.willShow=true;
                        setData(that,{ _show: true,animationName:slideUp});
                    }
                }
                else{
                    triggerEvent(that,'keyboardWillHide', detail_will);
                    that.willHide=true;
                    setData(that,{animationName:slideDown});
                }
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationName:'',
        _confirmType:L('Done'),
        _type:'',
        _show:false
    },


    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                setData(that,{_show:false})
                triggerEvent(that,'keyboardDidHide',detail_did);
            }
            if(that.willShow){
                that.willShow=false;
                triggerEvent(that,'keyboardDidShow',detail_did);
            }
        },
        onKeyUp:function(e){
            
            var that=this;

            that.clearTimer();

            var data=e.target.dataset;

            var command=data.command;

            if(command){
                if(command=='close-keyboard'){
                    wx.hideKeyboard();
                }
                return;
            }


            var keyCode=data.keyCode;
            var charCode=data.charCode;
            if(typeof charCode !='undefined') keyCode=(charCode+'').charCodeAt(0);

            if(keyCode==13)wx.vibrateShort();//震动

            triggerEvent(that,'sendKeys',{keyCode:keyCode,charCode:charCode});
        },
        clearTimer:function(){
            var that=this;
            if(that.timer_backspace1) clearInterval(that.timer_backspace1);
            if(that.timer_backspace2) clearInterval(that.timer_backspace2);
        },
        onBackspaceKeyDown:function(e){
            var that=this;
            that.clearTimer();
            triggerEvent(that,'sendKeys',{keyCode:8});
            that.timer_backspace1=setTimeout(function(){
                that.timer_backspace2=setInterval(function(){
                    triggerEvent(that,'sendKeys',{keyCode:8});
                },100);
            },500);
           
        },
        onBackspaceKeyUp:function(e){
            this.clearTimer();
        }
    }
})