//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :modal.js
//        description : 对话框组件

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');
var zoomFadeIn='nb-animate-zoom-fade-in',zoomFadeOut='nb-animate-zoom-fade-out',fadeIn='nb-animate-fade-in',fadeOut='nb-animate-fade-out';

//NBConfig 是 NewBest 框架的全局配置
var themeColor=(NBConfig && NBConfig.themeColor) || '#3cc51f';//主题颜色

function setData(that,data){
    that.setData(data);
}

function triggerEvent(that,eventName,options){
    that.triggerEvent(eventName,options);
}

var TYPE_STRING=String;

Component({

    externalClasses:["nb-picker__item","nb-picker__item_disabled",fadeIn,fadeOut,zoomFadeIn,zoomFadeOut],

    /**
     * 组件的属性列表
     */
    properties: {
        title:TYPE_STRING,
        content:TYPE_STRING,
        showCancel:{
            type:Boolean,
            value:true
        },
        cancelText:TYPE_STRING,
        cancelColor:TYPE_STRING,
        confirmText:TYPE_STRING,
        confirmColor:TYPE_STRING,
        show: {
            type: Number,
            value: 0,
            observer: function (newVal) {
                var that=this;
                if(newVal){
                    var props=that.properties;
                  
                    var list=that.data.list;
                    list.push({
                        title:props.title,
                        content:props.content,
                        showCancel:props.showCancel!==false,
                        cancelText:props.cancelText || L('Cancel'),
                        cancelColor:props.cancelColor || themeColor,
                        confirmText:props.confirmText || L('OK'),
                        confirmColor:props.confirmColor || themeColor,
                        animation:zoomFadeIn
                    });
                    setData(that,{
                        _show: true,
                        animationName_mask:fadeIn,
                        // animationName_modal:zoomFadeIn,
                        list:list
                    });
                }
                
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationName_mask: '',
        // animationName_modal: '',
        _show:false,
        // _title:'',
        // _content:'',
        // _showCancel:false,
        // _cancelText:'',
        // _cancelColor:'',
        // _confirmText:'',
        // _confirmColor:'',
        list:[]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                var list=that.data.list;
                
                if(list.length==1){
                    setData(that,{_show: false,list:[]});
                }
                else{
                    list.pop();
                    setData(that,{list:list});
                }

                var hideDetail=that.hideDetail;
                if(hideDetail){
                    triggerEvent(that,'success',hideDetail);
                }
                that.hideDetail=0;
            }
        },
        hide:function(e){
            var that=this;
            that.willHide=true;
            var data={};

            var list=that.data.list;
            var size=list.length;

            data['list['+(size-1)+'].animation']=zoomFadeOut;
    
            if(size==1){
                data.animationName_mask=fadeOut
            }
            setData(that,data)
        },
        onCancel:function(e){
            var that=this;
            that.hideDetail={cancel:true};
            that.hide();
        },
        onConfirm:function(e){
            var that=this;
            that.hideDetail={confirm:true};
            that.hide();
        }
    }
})