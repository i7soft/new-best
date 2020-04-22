//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :screenOrientation.js
//        description : 移动端屏幕旋转时，如果某个屏幕方向不允许使用出现的提示。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');
var PORTRAIT='portrait';
var LANDSCAPE='landscape';

Component({

    externalClasses:["nb-icon","nb-icon-go-to-portrait","nb-icon-go-to-landscape"],

    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: String,
            value: 'none',
            observer: function (newVal, oldVal, changedPath) {
                var _text='';
                if(newVal!='none'){
                    _text=String.Format(L('This application does not support {0}, \nplease rotate the screen to the {1} to continue to use.'),L(newVal==PORTRAIT?LANDSCAPE:PORTRAIT),L(newVal));
                    _icon=newVal;
                }
                this.setData({ _show: newVal,_text:_text });
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        _text: '',
        _icon: LANDSCAPE,
        _show:'none'
    },

    // lifetimes:{
    //     attached:function(){
    //         var animation = wx.createAnimation({
    //             duration: 250,
    //             timingFunction: 'ease',
    //         });
    //         this.animation = animation;

    //     }
    // },

    // /**
    //  * 组件的方法列表
    //  */
    // methods: {
    //     onTransitionEnd:function(e){
    //         var that=this;
    //         if(!that.properties.show){
    //             that.setData({_show:false})
    //         }
    //     }
    // }
})