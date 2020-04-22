//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :L.js
//        description : 多语言国际性支持。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var lang={
    'en':{
        DateTime:{
            ShortDate:'yyyy/MM/d',
            LongDate:'dddd, dd MMMM yyyy',
            ShortTime:'HH:mm',
            LongTime:'HH:mm:ss',
            A:'A',
            P:'P',
            AM:'AM',
            PM:'PM',
            m:'MMMM dd',//Month day pattern
            y:'yyyy MMMM',//Year month pattern
            months : 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
            monthsShort : 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
            weekdays : 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
            weekdaysShort : 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
        }
    },
    'zh_CN':require('../language/zh_CN')
};

lang['zh-Hans']=lang.zh_CN;//兼容处理

module.exports = function(input,defaultValue,language){
    language=language || wx.getSystemInfoSync().language;
    if(lang[language] && lang[language][input]){
        return lang[language][input];
    }
    else return lang.en[input] || defaultValue || input;
};