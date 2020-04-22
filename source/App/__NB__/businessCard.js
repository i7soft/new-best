//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :businessCard.js
//        description : 根据联系人信息，生成联系人二维码，是 wx.addPhoneContact 在浏览器上的一个实现方式。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');


var vCardsJS=require('./utils/vCard');
var fadeIn='nb-animate-fade-in',fadeOut='nb-animate-fade-out';
var Common=require("./utils/Common");


var flag_willCloseDialog=false;

function setData(that,data){
    that.setData(data);
}

function utf16to8(str) {

 

    var out, i, len, c;  

    out = ""; 
    len = str.length;  

    for (i = 0; i < len; i++) {  
        c = str.charCodeAt(i);  
        if ((c >= 0x0001) && (c <= 0x007F)) { 
            out += str.charAt(i);  
        } else if (c > 0x07FF) { 
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F)); 
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));  
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F)); 
        } else {  
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));  
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F)); 
        }  

    }  

    return out; 
}

Component({

    externalClasses:[fadeIn,fadeOut,'nb-icon','nb-icon-close'],

     /**
     * 组件的属性列表
     */
    properties: {
        
        data: Object,
        show:{
            type:Number,
            value:0,
            observer: function (newVal) {
                var that=this;
                if(newVal){
                    var properties=that.properties;

                    var data=properties.data;

                    var vCard = vCardsJS();
                  
                    
                    for(var key in data){
                        var item=data[key];
                        if(typeof item !='function'){
                            if(key=='photoFilePath'){
                              
                                
                            }
                            else if(key=='weChatNumber'){
                                vCard.socialUrls[utf16to8((L('WeChat')))]=utf16to8(item);
                            }
                            else if(key.indexOf('ddress')>-1){
                                var address='address';
                                // var label='Address';
                                if(key.indexOf('work')>-1){
                                    address='workAddress';
                                    // label='Work '+label;
                                }
                                else if(key.indexOf('home')>-1){
                                    address='homeAddress';
                                    // label='Home '+label;
                                }
                                // vCard[address].lable=utf16to8(L(label));
                                vCard[address][key.replace(address,"")]=utf16to8(item);
                            }
                            else{
                              
                                vCard[key]=utf16to8(item);
                            }
                        }
                    };

                    var s=vCard.getFormattedString();

                  

                    setData(that,{
                               
                        showDialog:true,
                        
                    });

                    Common.qrcode({
                        text:s,
                        canvasId:'qrcodeCanvas',
                        size:1200,
                        logo:data.photoFilePath,
                        success:function(base64Url){
                           
                            setData(that,{
                                qrcode_src:base64Url,
                                dialog_animationName:fadeIn
                            });
                        }
                    },that);

                  
                
                }
              
            }
        },
    },

    data:{
        showDialog:false,
        qrcode_src:'',
        dialog_animationName:'',
        text:L('Long press the QR code to save the contact')
    },

    methods:{
      
        none:function(){
            //do nothing
            return false;
        },
        //关闭对话框
        dialog_close:function(){
            flag_willCloseDialog=true;
            setData(this,{
                dialog_animationName:fadeOut
            })
        },
        //对话框动画完成事件
        dialog_onAnimationEnd:function(){
            var that=this;
            if(flag_willCloseDialog){
                flag_willCloseDialog=false;
                setData(that,{
                    showDialog:false,
                    dialog_animationName:''
                })
            }
        },
    }

})