//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :share.js
//        description : 分享操作。

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================


var Common=require("./utils/Common");

var fadeIn='nb-animate-fade-in',fadeOut='nb-animate-fade-out';

function setData(that,data){
    that.setData(data);
}

var isApp=NB && NB.IsApp,isWechat=NB && NB.IsWechat,isWeb=NB && NB.IsWeb;//可以根据平台的不同，向用户展示不同的分享界面

var socialPlatform={
    qq:{
        url:'http://connect.qq.com/widget/shareqq/index.html?url={url}&desc={title}&pics={pic}'
    },
    weibo:{
        url:'http://service.weibo.com/share/share.php?url={url}&title={title}&pic={pic}&searchPic=false'
    },
    wechat:{
        url:''
    },
    douban:{
        url:'http://www.douban.com/share/service?href={url}&name={title}&text={content}&image={pic}'
    },
    qzone:{
        url:'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&pics={pic}&summary={content}'
    },
    linkedin:{
        url:'https://www.linkedin.com/shareArticle?title={title}&summary={content}&mini=true&url={url}&ro=true'
    },
    facebook:{
        url:'https://www.facebook.com/sharer/sharer.php?u={url}&t={title}&pic={pic}'
    },
    twitter:{
        url:'https://twitter.com/intent/tweet?text={title}&url={url}'
    }
}

Component({

    externalClasses:[fadeIn,fadeOut],

    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Number,
            value: 0,
            observer: function (newVal) {
                var that=this;
                if(newVal){
                    that.setData({ 
                        _show: newVal,
                        _info:that.properties.info,
                        animationName:fadeIn,
                        qrcode_show:false
                    });
              
                }
                else{
                   
                    that.setData({animationName:fadeOut });
                }
                
            }
        },
        info:Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        _show:0,
        _info:{},
        animationName:'',
        social:['qq','wechat','weibo','qzone'],
        qrcode_src:'',
        qrcode_show:false,
        qrcode_left:0,
        qrcode_top:0,
        showSocialShare:isWeb && !isWechat,
		isWechat:isWechat
    },


    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                that.setData({_show:0})
            }
        },
        hide:function(){
            var that=this;
            that.willHide=true;
            that.setData({animationName:fadeOut });
        },
        none:function(){
            //do nothing
        },
        jumpSocialShare:function(e){
            
            var that=this;
            var currentTarget=e.currentTarget;

            var dataset=currentTarget.dataset;

            var shareInfo=that.properties.info;
            var data=that.data;

            var name=dataset.name;

            

            var imgUrl=shareInfo.imgUrl;
            var link=shareInfo.link;


            if(name=='wechat'){
                if(data.qrcode_show){
                    setData(that,{
                        qrcode_show:false,
                    })
                }
                else{


                    if(that.shareUrl==link){
                        //分享地址没变的话直接显示
                        setData(that,{
                            qrcode_show:true
                        });
                    }
                    else{

                        that.shareUrl=link;

                        Common.qrcode({
                            text:encodeURI(link),
                            canvasId:'qrcodeCanvas',
                            size:1200,
                            logo:imgUrl,
                            success:function(base64Url){
                                setData(that,{
                                    qrcode_show:true,
                                    qrcode_src:base64Url
                                });
                            }
                        },that);

                    }

                   
                }
            }
            else{

                var url=socialPlatform[name].url;
                url = url.replace('{url}', link);
                url = url.replace('{title}', shareInfo.title);
                url = url.replace('{content}', shareInfo.desc);
                url = url.replace('{pic}', shareInfo.imgUrl);

                if(data.qrcode_show){
                    setData(that,{
                        qrcode_show:false
                    })
                }

                window.open(url);
            }
       
           
        }
    }
})