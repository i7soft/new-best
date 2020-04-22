//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :Px.js
//        description : 将其他单位的尺寸转换为 px。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

module.exports=function(value){
    if(typeof value =='string'){
        if(value.indexOf('rpx')>-1){
            value=parseFloat(value.replace('rpx',''));
            value=wx.getSystemInfoSync().screenWidth*value/750;
        }
        else if(value.indexOf('px')>-1){
            value=parseFloat(value.replace('px',''));
        }
        else{
            value=parseFloat(value);
        }
    }
    return value;
}