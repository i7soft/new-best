//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :picker.js
//        description : picker 组件的弹出层

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');

var fadeIn='nb-animate-fade-in',fadeOut='nb-animate-fade-out',slideUp='nb-animate-slide-up',slideDown='nb-animate-slide-down';


function setData(that,data){
    that.setData(data);
}

function triggerEvent(that,eventName,options){
    that.triggerEvent(eventName,options);
}

Component({

    externalClasses:["nb-picker__item","nb-picker__item_disabled",fadeIn,fadeOut,slideUp,slideDown],

    /**
     * 组件的属性列表
     */
    properties: {
  
        show: {
            type: Object,
            value: null,
            observer: function (newVal, oldVal) {
                var that=this;

                if(newVal && !oldVal){

                    //display 非 none 的情况下动画才有效果
                    that.willShow=true;//打开的时候不用响应 range 属性的数据变化
                    //弹开的时候，range 和 value 都放在 newVal 里面，是防止需要执行多次 setData
                    setData(that,{
                        _show: true,
                        _range:newVal.range,
                        _value:newVal.value,
                        animationName_mask:fadeIn,
                        animationName_picker:slideUp
                    });

                }
                else if(!newVal && oldVal){
                    that.willHide=true;//picker 是否要关闭的标记
                    setData(that,{ 
                        animationName_mask:fadeOut,
                        animationName_picker:slideDown
                    });
                }
            }
        },
        value:{
            type:null,
            value:[],
            observer: function (newVal) {
                var that=this;
                if(!that.willShow) setData(that,{_value:newVal});
            }
        },
        range:{
            type:Array,
            value:[],
            observer: function (newVal) {
                var that=this;
                if(!that.willShow) setData(that,{_range:newVal});
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationName_mask: '',
        animationName_picker: '',
        button_cancel:L('Cancel'),
        button_ok:L('OK'),
        _show:false,
        _range:[],
        _value:[]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            that.willShow=false;
            if(that.willHide){
                that.willHide=false;
                setData(that,{_show: false,_range:[]});
            }
        },
        onPickerChange:function(e){
            
            triggerEvent(this,'change',e.detail);
        },
        onCancel:function(e){
            triggerEvent(this,'cancel');
        },
        onConfirm:function(e){
            triggerEvent(this,'confirm');
        }
    }
})