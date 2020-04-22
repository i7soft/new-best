//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :pageLoader.js
//        description : 加载 page 时的等待界面。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');

Component({

    
    externalClasses:["nb-loading","nb-loading-icon"],
    /**
     * 组件的初始数据
     */
    data: {
        text:L('Page Loading~')
    },

    
})