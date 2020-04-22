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
var Px=require('./utils/Px');
var GPS=require('./map/GPS');
var cover=require('./map/cover');

//NBConfig 是 NewBest 框架的全局配置
var themeColor=(NBConfig && NBConfig.themeColor) || '#3cc51f';//主题颜色

var slideUp='nb-animate-slide-up',slideDown='nb-animate-slide-down';

var isAndroid=NB.IsAndroid;

function setData(that,data){
    that.setData(data);
}

function triggerEvent(that,eventName,options){
    that.triggerEvent(eventName,options);
}

var isApp=NB && NB.IsApp,isWechat=NB && NB.IsWechat,isMobile=NB.IsMobile,isWeb=NB.IsWeb,isIOS=NB.IsIOS;//可以根据平台的不同，向用户展示不同的分享界面


var nbConfig=NBConfig;

var flag_showSearch;

function getBoundingClientRect(that,query,callback){
    that.createSelectorQuery().select(query).boundingClientRect(function(res){
          
        callback(res);
    })
}

var timer_getLocation,flag_getLocation;

function getLocation(that,callback){

   
    timer_getLocation=setTimeout(function(){
        !flag_getLocation && wx.showLoading({title:L('Getting your location')});
    },1000);

    wx.getLocation({
        type:'gcj02',
        success:function(res){

            flag_getLocation=true;

            if(callback){
                callback(res); 
            }
            else{
                var latitude=res.latitude;
                var longitude=res.longitude;
                
                setData(that,{
                    latitude:latitude,
                    longitude:longitude,
                    showMarker:true,
                    showMakerAnimation:true
                });

                placeSearchByCenter(that,latitude,longitude);
            }
           
        },
        fail:function(){
            wx.showModal({
                title:L('Positioning failed'),
                content: L('Do you want to regain your location?'),
                success (res) {
                    if (res.confirm) {
                        getLocation(that,callback);
                    } 
                }
            })
        },
        complete:function(){
            clearTimeout(timer_getLocation);
            wx.hideLoading();
        }
    })
}


function showToast(msg){
    wx.showToast({
        title:msg,
        icon:'none'
    })
}

var ts_placeSearch=0;
function placeSearchByCenter(that,latitude,longitude){

    var ts=ts_placeSearch=+new Date();

    var map =that.map;
    if(!map) map=that.map= wx.createMapContext('map',that);
    map.placeSearch({
        latitude:latitude,
        longitude:longitude,
        radius:500,
        success:function(res){

            if(ts!=ts_placeSearch) return;

            var pois=res.pois;
            setData(that,{
                scrollTop:0,
                pois:pois,
                locationIndex:0
            })
        },
        fail:function(res){

            if(ts!=ts_placeSearch) return;

            showToast(res.errMsg)
        }
    });
}

var timer_search;

function placeSearchBykeyword(that,keyword){

    if(that.searchKeyword==keyword) return;

    that.searchKeyword=keyword;

    var ts=ts_placeSearch=+new Date();

    var map =that.map;
    map=that.map= wx.createMapContext('map',that);

    if(!map){
        showToast(L('Load failed, reason: ')+L('Positioning failed'));
        return;
    }

    map.placeSearch({
        keyword:keyword,
        success:function(res){

            if(ts!=ts_placeSearch) return;

            var pois=res.pois;
            if(pois.length==0){
                showToast(L('No result'))
            }

            setData(that,{
                pois2:pois,
                scrollTop2:0
            })
        },
        fail:function(res){

            if(ts!=ts_placeSearch) return;

            showToast(res.errMsg)
        }
    });
}

Component({

    externalClasses:[slideUp,slideDown,'nb-icon','nb-icon-search','input-placeholder','nb-link','navigator-hover'],

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

                    var res=wx.getSystemInfoSync();
                    var bottomPadding=20;
                    if(isWeb && isMobile){
                        var safeArea=res.safeArea;
                        if(safeArea.height<res.screenHeight){
                            bottomPadding=40;
                        }
                    }
            

                    setData(that,{
                        bottomPadding:bottomPadding,
                        _show: true,
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
        mapMaskOpacity:0,
        showSearchInput:false,
        showMarker:false,
        showMakerAnimation:false,
        inputValue:'',
        inputDisabled:isAndroid,
        bottomPadding:20,
        _data:{},
        _show:0,
        animationName:'',
        _rotate:0,
        _skew:0,
        _scale:18,
        rotate:0,
        skew:0,
        scale:18,
        enableRotate:false,
        themeColor:themeColor,
        // markers:[],
        bottomLeftMargin:{
            x:'20rpx',
            y:'500rpx'
        },
        topRightMargin:{
            x:'20rpx',
            y:'120rpx'
        },
        bottomRightMargin:{
            x:'20rpx',
            y:'500rpx'
        },
        text1:L('Cancel'),
        text2:L('Search location'),
        text3:L('OK')
    },


    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                setData(that,{
                    _show:0,
                    showMarker:false
                })
            }
            else{
                that.mapLoadComplete=false;
                getLocation(that,function(res){

                    var latitude=res.latitude;
                    var longitude=res.longitude;

                    setData(that,{
                        latitude:latitude,
                        longitude:longitude,
                        showMap:true,
                        showMarker:true
                    });

                    that.mapLoadCompleteCallback=function(){
                        placeSearchByCenter(that,latitude,longitude);
                    }
                });
               
                
            }
        },
        hide:function(){
            var that=this;
            that.close();

            triggerEvent(that,'fail')
        },
        close:function(){
            var that=this;
            that.willHide=true;
            setData(that,{animationName:slideDown});
        },
        showSearch:function(){
            if(flag_showSearch) return;

            flag_showSearch=true;

            var that=this;
            var cancelSearchWidth=that.data.cancelSearchWidth;
            if(cancelSearchWidth){
             
                setData(that,{
                    showSearch:true,
                    showMapMask:true
                })
            }
            else{
                getBoundingClientRect(that,'.search-cancel',function(res1){
                    getBoundingClientRect(that,'.input-text',function(res2){
                        setData(that,{
                            cancelSearchWidth:res1.width,
                            searchInputLeft:parseInt(res2.left-Px('20rpx')),
                            showSearch:true,
                            showMapMask:true
                        })
                    });
                });
            }
            wx.nextTick(function(){
                setData(that,{
                    mapMaskOpacity:1
                })
            })
        },
        //搜索框显示的动画结束
        onSearchAnimationEnd:function(){
            var that=this;
            if(flag_showSearch){
           
              
                setData(that,{
                    showSearchInput:true,
                    inputDisabled:false
                });

                //android 延后弹出键盘，避免卡顿
                if(isAndroid) wx.nextTick(function(){
                    setData(that,{
                        inputFocus:true
                    })
                });
            }
            else{
                setData(that,{
                    pois2:[],
                    showMapMask:false
                })
            }
        },
        //隐藏搜索框
        hideSearch:function(){
            if(!flag_showSearch) return;

            var that=this;

            // var that=this;
            if(timer_search)clearTimeout(timer_search);
            that.searchKeyword='';

            flag_showSearch=false;
            setData(that,{
                inputValue:'',
                showSearchInput:false,
                showSearch:false,
                mapMaskOpacity:0,
                inputFocus:false,
                showClearInput:false,
                inputDisabled:isAndroid?true:false
            });
        },
        search_onInput:function(res){
            var that=this;
            var value=res.detail.value;
            var showClearInput=that.data.showClearInput;

            var data={};

            if(timer_search)clearTimeout(timer_search);

            if(value===''){
                data.pois2=[];
                if(showClearInput){
                    data.showClearInput=false;
                }
            }
            else{
                if(!showClearInput){
                    setData(that,{
                        showClearInput:true
                    })
                    data.showClearInput=true;
                }

                
                timer_search=setTimeout(function(){
                    placeSearchBykeyword(that,value.Trim());
                },800);
            }

            setData(that,data);
        },
        //清除搜索框内容
        clearInput:function(){
            setData(this,{
                showClearInput:false,
                inputValue:''
            })
        },
        marker_onAnimationEnd:function(){
            setData(this,{
                showMakerAnimation:false
            })
        },
        myLocation:function(){
            getLocation(this);
        },
        onMapComplete:function(){
            var that=this;
            if(!that.mapLoadComplete){//地图加载完成
                that.mapLoadComplete=true;

                that.mapLoadCompleteCallback();
                that.mapLoadCompleteCallback=undefined;
            }
        },
        chooseLocation:function(e){
            var that=this;
            var index=e.currentTarget.dataset.index;

            var currentIndex=that.data.locationIndex;

            var locationItem=that.data.pois[index];

            var data={
                latitude:locationItem.latitude,
                longitude:locationItem.longitude
            };

            if(currentIndex !=index){
               data.locationIndex=index;
            }

            setData(that,data);
        },
        search_onConfirm:function(e){
            var value=e.detail.value.Trim();
            if(value){
                if(timer_search)clearTimeout(timer_search);
                placeSearchBykeyword(this,value);
            }
            else{
                showToast(L('Please enter the place you want to search first.'));
            }
        },
        chooseLocation2:function(e){
            var that=this;
            var index=e.currentTarget.dataset.index;

            var res=that.data.pois2[index];

            var latitude=res.latitude;
            var longitude=res.longitude;

            setData(that,{
                latitude:latitude,
                longitude:longitude,
                showMarker:true,
                showMakerAnimation:true
            });

            placeSearchByCenter(that,latitude,longitude);

            that.hideSearch.call(that);


        },
        mapCommand:function(e){
            setData(this,e.detail);
           
        },
        regionChange:function(e){
            var that=this;
            var causedBy=e.causedBy;
            var type=e.type;
            var detail=e.detail;
            if(causedBy=='rotate'){
            }
            else if(causedBy=='skew'){
            }
            else{

                setData(that,{
                    _scale:detail.scale
                });

                if(causedBy=='drag' && type=='end'){

                    setData(that,{
                        showMakerAnimation:true
                    });

                    var map=that.map;
                    map.getCenterLocation({
                        success:function(res){
                            placeSearchByCenter(that,res.latitude,res.longitude);
                        }
                    })
                }
            }

            
        },
        confirm:function(){
            var that=this;
            that.close();
            triggerEvent(that,'success',that.data.pois[that.data.locationIndex]);
        }
    },
    
})