//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :toast.js
//        description : 信息提示组件。
 
//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================
 
var System=require('/__NB__/dotNet/System');
 
var fadeIn='nb-animate-zoom-fade-in',fadeOut='nb-animate-zoom-fade-out';
 
function setData(that,data){
    that.setData(data);
}

// function getTimestamp(){
//     return +new Date();
// }

var timer_toast;
var timer_close;
 
Component({
 
    externalClasses:["nb-loading","nb-loading-icon",fadeIn,fadeOut],
 
    /**
     * 组件的属性列表
     */
    properties: {
        data:Object,
        show: {
            type: Number,
            value: 0,
            observer: function (newVal,oldVal) {
                var that=this;

                if(newVal>0){
                   
                    if(timer_close){
                        clearTimeout(timer_close);
                        timer_close=null;
                        setData(that,{ _show: false });
                    }

                    var data=that.properties.data;

                    var duration=data.duration ;
                    var icon=data.icon;

                    setData(that,{ _show: true,data:data });
                    setData(that,{animationName:fadeIn });

                    

                    if(timer_toast)clearTimeout(timer_toast);
                    
                    if(icon!='loading') {
                        timer_toast=setTimeout(function(){

                            setData(that,{animationName:fadeOut });

                            timer_close=setTimeout(function(){
                                setData(that,{ _show: false });
                                timer_close=null;
                            },300);

                        },(duration|| 1500)+300);
                    }
                   
                }
                else if(newVal<0 && oldVal>0){
                  
                    if(timer_toast)clearTimeout(timer_toast);
                    if(timer_close)clearTimeout(timer_close);
                    setData(that,{animationName:fadeOut });
                    timer_close=setTimeout(function(){
                        setData(that,{ _show: false });
                        timer_close=null;
                    },300);
                }
                
            }
        },
    },
 
    /**
     * 组件的初始数据
     */
    data: {
       
        _title: '',
        _icon: 'success',
        _image: '',
        _mask: false,
        _show:false,
        animationName:''
    },
 
})