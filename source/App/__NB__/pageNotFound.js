//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :pageNotFound.js
//        description : 当 page 加载出错（page 不存在或加载有误）显示的错误页面。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');

Component({

    

    /**
     * 组件的初始数据
     */
    data: {
        text:L('Sorry, the page does not exist or is loaded incorrectly~')
    },

    
})