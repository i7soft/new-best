//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :imageLoader.js
//        description : image 组件懒加载时，显示 loader；如果加载出错，显示重新加载按钮。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');

Component({

    externalClasses:["nb-loading","nb-loading-icon"],

     /**
     * 组件的属性列表
     */
    properties: {
        reload: {
            type: Boolean,
            value: false,
            observer: function (newVal) {
                this.setData({_reload:newVal})
            }
        }
    },

    data:{
        _reload:false,
        text:L('Click to Reload Image')
    },

    methods:{
        reload:function(){
            //重新加载图片
            this.triggerEvent('reload');
        }
    }

})