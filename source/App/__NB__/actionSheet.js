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
var slideUp='nb-animate-slide-up',slideDown='nb-animate-slide-down',fadeIn='nb-animate-fade-in',fadeOut='nb-animate-fade-out';

//NBConfig 是 NewBest 框架的全局配置
// var themeColor=(NBConfig && NBConfig.themeColor) || '#3cc51f';//主题颜色

function setData(that,data){
    that.setData(data);
}

function triggerEvent(that,eventName,options){
    that.triggerEvent(eventName,options);
}

Component({

    externalClasses:["nb-picker__item","nb-picker__item_disabled",fadeIn,fadeOut,slideUp,slideDown,'navigator-hover'],

    /**
     * 组件的属性列表
     */
    properties: {
        itemList:Array,
        itemColor:String,
        show: {
            type: Number,
            value: 0,
            observer: function (newVal) {
                var that=this;
                if(newVal){
                    var props=that.properties;

                    var itemList=props.itemList;

                    var list=[];
                    var listGroup=[];
                    for(var i=0,l=itemList.length;i<l;i++){
                        var item=itemList[i];
                       
                        if(item=='-'){
                            list.push(listGroup);
                            listGroup=[];
                        }
                        else{
                            listGroup.push({id:i,item:item});
                            if(i==l-1){
                                list.push(listGroup);
                            }
                        }
                    }

                    setData(that,{
                        animationName_mask:fadeIn,
                        animationName_actionSheet:slideUp,
                        _itemList:list,
                        _itemColor:props.itemColor,
                        _show: true,
                    });
                }
                // else{
                //     that.willHide=true;
                //     setData(that,{animationName_mask:fadeOut,animationName_actionSheet:slideDown });
                // }
                
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationName_mask: '',
        animationName_actionSheet: '',
        button_cancel:L('Cancel'),
        _show:false,
        _itemList:[],
        _itemColor:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                setData(that,{_show: false});
            }
        },
        hide:function(){
            var that=this;
            that.willHide=true;
            setData(that,{
                animationName_mask:fadeOut,
                animationName_actionSheet:slideDown,
            });
        },
        onCancel:function(e){
            var that=this;
            that.hide();
            triggerEvent(that,'fail');
        },
        onConfirm:function(e){
            var index=e.currentTarget.dataset.index;
            var that=this;
            that.hide();
            triggerEvent(that,'success',{tapIndex:index});
        }
    }
})