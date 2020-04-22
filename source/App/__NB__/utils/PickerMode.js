//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :PickerMode.js
//        description : 为系统组件 picker 的 mode（region、date）提供数据源支持。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./L');
var ChineseRegion=require('./ChineseRegion');//按需要引入中国的省市地区三级联动数据库

module.exports={
    region:ChineseRegion,
    date:{
        format:L('month-day-year'),
        data:{
            year:L('{year}'),
            month:[
                L('January'),
                L('February'),
                L('March'),
                L('April'),
                L('May'),
                L('June'),
                L('July'),
                L('August'),
                L('September'),
                L('October'),
                L('November'),
                L('December'),
            ],
            day:L('{day}')
        }
    }
}