//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :openLocation.js
//        description : 打开地图位置。
//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');
var GPS=require('./map/GPS');

var slideUp='nb-animate-slide-up',slideDown='nb-animate-slide-down';

function setData(that,data){
    that.setData(data);
}

// function triggerEvent(that,eventName,options){
//     that.triggerEvent(eventName,options);
// }


var nbConfig=NBConfig;
var appId=nbConfig.appId;

var __window=typeof window=='undefined'?null:window;

var timer_openApp;

function stopOpenApp(){
    timer_openApp && clearTimeout(timer_openApp);
    __window && $(__window).off('beforeunload pagehide blur',stopOpenApp);
}

function openMapApp(scheme,url){
    if(NB.IsWeb){
        if(NB.IsMobile || NB.IsMac){
            __window.location.href = scheme;

            if(url && NB.IsAndroid){

                timer_openApp=setTimeout(function(){
                    wx.showModal({
                        content: L('Failed to open map app, do you want to open navigation page in new window?'),
                        success (res) {
                            if (res.confirm) {
                                __window.open(url);
                            } 
                        }
                    })
                      
                },2000);

                $(__window).on('beforeunload pagehide blur',stopOpenApp);
            }
        }
        else{
            __window.open(url);
        }
    }
}


var mapUrls={
    apple:function(lat,lng,name,address){
        // https://www.jianshu.com/p/082745cf04a8
        var scheme=String.Format("http://maps.apple.com/?t=m&ll={0},{1}&q={2}&address={3}",lat,lng,name,address);
        openMapApp(scheme);
    },
    amap:function(lat,lng,name,address){
        // https://lbs.amap.com/api/amap-mobile/guide/android/route
        var scheme=String.Format("amapuri://route/plan/?dlat={0}&dlon={1}&dname={2}&sourceApplication={3}&dev=0&t=0",lat,lng,name,appId);

        // https://lbs.amap.com/api/uri-api/guide/travel/route
        var url=String.Format("https://uri.amap.com/navigation?to={1},{0},{2}&src={3}",lat,lng,name,appId);

        openMapApp(scheme,url);
    },
    qq:function(lat,lng,name,address){
        // https://lbs.qq.com/uri_v1/guide-mobile-navAndRoute.html
        var scheme=String.Format("qqmap://map/routeplan?type=drive&fromcoord=CurrentLocation&to={2}&tocoord={0},{1}&referer={3}",lat,lng,name,appId);

        // https://lbs.qq.com/uri_v1/guide-route.html
        var url=String.Format("https://apis.map.qq.com/uri/v1/routeplan?type=drive&to={2}&tocoord={0},{1}&referer={3}",lat,lng,name,appId);

        openMapApp(scheme,url);
    },
    baidu:function(lat,lng,name,address){
        // http://lbsyun.baidu.com/index.php?title=uri/api/ios
        var scheme=String.Format("baidumap://map/direction?destination=latlng:{0},{1}|name:{2}&coord_type=gcj02&mode=driving&src={3}",lat,lng,name,appId);

        // https://lbsyun.baidu.com/index.php?title=uri/api/web
        var url=String.Format("http://api.map.baidu.com/direction?destination=latlng:{0},{1}|name:{2}&mode=driving&output=html&coord_type=gcj02&src={3}",lat,lng,name,appId);

        openMapApp(scheme,url);
    },
    google:function(lat,lng,name,address){
        // http://lbsyun.baidu.com/index.php?title=uri/api/ios
        var scheme=String.Format("comgooglemaps://?daddr={0},{1}",lat,lng);

        // https://developers.google.com/maps/documentation/urls/guide#directions-action
        var url=String.Format("https://www.google.com/maps/dir/?api=1&destination={0},{1}|bobo",lat,lng);

        openMapApp(scheme,url);
    },
};

var storageKey="nb:openLocation";

//保存地图设置
function saveMapOption(key,value){
    var options=getMapOptions();
    options[key]=value;
    wx.setStorage({
        key: storageKey,
        data: options
    });
}

//获取地图设置
function getMapOptions(){
    
    var options=wx.getStorageSync(storageKey) || {};
    if(typeof options !='object')options={};
   
    return options;
}

Component({

    externalClasses:[slideUp,slideDown,'nb-icon','nb-icon-close','nb-icon-navigation'],

    /**
     * 组件的属性列表
     */
    properties: {
        data:Object,
        show: {
            type: Number,
            value: 0,
            observer: function (newVal) {
                var that=this;
                if(newVal){
                    that.isShowRoute=false;

                    var detail=that.properties.data;

                    var scale=detail.scale ||18;
                    var latitude=detail.latitude;
                    var longitude=detail.longitude;

                    var mapOptions=getMapOptions();

                    var rotate=mapOptions.rotate ||0;
                    var skew=mapOptions.skew ||0;

                    setData(that,{

                        _show: true,
                        
                        latitude: latitude,
                        longitude: longitude,
                        scale:scale,
                        _scale:scale,
                        rotate:rotate,
                        _rotate:rotate,
                        skew:skew,
                        _skew:skew,
                        markers:[{
                            id: 1,
                            latitude: latitude,
                            longitude: longitude,
                            callout:{
                                display:'ALWAYS',
                                content:detail.name
                            }
                        }],
                        name:detail.name,
                        address:detail.address,
                        animationName:slideUp
                    });

                }
                
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        _data:{},
        _show:0,
        animationName:'',
        _rotate:0,
        _skew:0,
        _scale:18,
        rotate:0,
        skew:0,
        scale:18,
        showLocation:true,
        enableRotate:false,
        bottomLeftMargin:{
            x:'20rpx',
            y:'240rpx'
        },
        bottomRightMargin:{
            x:'20rpx',
            y:'240rpx'
        },
        topRightMargin:{
            x:'20rpx',
            y:'120rpx'
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                setData(that,{_show:0})
            }
            else{
                setData(that,{showMap:true})
            }
        },
        hide:function(){
            var that=this;
            that.willHide=true;
            setData(that,{animationName:slideDown});
        },
        mapCommand:function(e){
            var detail=e.detail;
            setData(this,e.detail);
           
            if(detail.hasOwnProperty('rotate')){
                saveMapOption('rotate',detail.rotate)
            }

            if(detail.hasOwnProperty('skew')){
                saveMapOption('skew',detail.skew)
            }
        },
        regionChange:function(e){
            var that=this;
            var causedBy=e.causedBy;
            var type=e.type;
            var detail=e.detail;

            var isEnd=type=='end';

            if(causedBy=='rotate'){
                setData(that,{
                    _rotate:detail.rotate
                });

                if(isEnd){
                    saveMapOption('rotate',detail.rotate)
                }
            }
            else if(causedBy=='skew'){
                setData(that,{
                    _skew:detail.skew
                });

                if(isEnd){
                    saveMapOption('skew',detail.skew)
                }
            }
            else{
                setData(that,{
                    _scale:detail.scale
                })
            }
        },
        navigation:function(){

            var that=this;

            var isShowRoute=that.isShowRoute;

            var data=that.data;
            var lat=data.latitude;
            var lng=data.longitude;
            var name=encodeURIComponent(data.name);
            var address=encodeURIComponent(data.address);

            var itemList=[L(isShowRoute?'Hide route':'Show route'),'-',L('Gaode Map'),L('Google Map'),L('QQ Map'),L('Baidu Map')];
            if(NB.IsIOS || NB.IsMac){
                itemList.push(L('Apple Map'));
            }

            wx.showActionSheet({
                itemList: itemList,
                success (res) {
                    var tapIndex=res.tapIndex;

                    if(tapIndex==0){
                        if(isShowRoute){//隐藏路线
                            that.routePlan.clear();
                        }
                        else{//显示路线
                            wx.showLoading({
                                title:L('Loading route')
                            });
                            wx.getLocation({
                                type:'gcj02',
                                success:function(res2){
                                    var map = wx.createMapContext('map',that);
                                    that.routePlan=map.routePlan({
                                        type:'driving',
                                        origin:{longitude:res2.longitude,latitude:res2.latitude},
                                        destination:{longitude:lng,latitude:lat},
                                        success:function(){
                                            wx.hideLoading();
                                        },
                                        fail:function(res3){
                                            wx.hideLoading();
                                            wx.showToast({
                                                title:L('Load failed, reason: ')+res3.errMsg,
                                                icon:'none'
                                            })
                                        }
                                    });
                                }
                            });
                           
                        }
                        that.isShowRoute=!isShowRoute;
                    }
                    else if(tapIndex==2){
                        mapUrls.amap(lat,lng,name,address);
                    }
                    else if(tapIndex==3){
                        mapUrls.google(lat,lng,name,address);
                    }
                    else if(tapIndex==4){
                        mapUrls.qq(lat,lng,name,address);
                    }
                    else if(tapIndex==5){
                        mapUrls.baidu(lat,lng,name,address);
                    }
                    else if(tapIndex==6){
                        mapUrls.apple(lat,lng,name,address);
                    }
                   
                }
            })
              
        }
    },
    
})