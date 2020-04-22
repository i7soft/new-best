//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :map/web/amap.js
//        description : map 组件的高德地图实现。
//                      map 组件的 marker 增加属性“autoRotate”，意思是地图旋转的时候，此 marker 会跟着旋转

//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================



var L=require('../../utils/L')
var Px=require('../../utils/px');
var Common=require('../../utils/Common');
var System=require('../../dotNet/System');
var GPS=require('../GPS');
var Color=require('../../utils/Color');

var mapCover=require('../cover');


function IsSet(value){
    return value!==null && typeof value !='undefined'
}

function showLayerLoading(){
    wx.showLoading({title:L('Layer loading')})
}

var urlPath=NBConfig.debug?'debug':'release';

function getImageFullPath(src){
    return System.IO.Path.Combine(NBConfig.url[urlPath],NBConfig.rootPath[urlPath],src)
}

function getMaxWidth(jq_map){
    var infoWindow_maxWidth=jq_map.width();
    infoWindow_maxWidth=infoWindow_maxWidth*4/5;
    if(infoWindow_maxWidth>480)infoWindow_maxWidth=480;

    return infoWindow_maxWidth;
}

//生成信息窗口的内容
function getCalloutContent(maxWidth,callout){
                       
    

    return String.Format(mapCover.template_infoWindow,
        maxWidth,//infoWindow 的最大宽度
        callout.content.replace(/\n/g,"<br/>"),
        callout.color,
        callout.fontSize,
        callout.borderRadius,
        callout.borderWidth,
        callout.borderColor,
        callout.bgColor,
        callout.padding,
        callout.textAlign
    );
}

function getLabelContent(maxWidth,lable){



    return String.Format(mapCover.template_label,
        maxWidth,//infoWindow 的最大宽度
        lable.content.replace(/\n/g,"<br/>"),
        lable.color,
        lable.fontSize,
        lable.borderRadius,
        lable.borderWidth,
        lable.borderColor,
        lable.bgColor,
        lable.padding,
        lable.textAlign
    );
}

function getMapDetail(e){
    return {map:{
        longitude:e.lnglat.lng,
        latitude:e.lnglat.lat,
        x:e.pixel.x,
        y:e.pixel.y
    }}
}

//获取地图的旋转角度
function getMapRotate(map){
    return map.getRotation();
}

function getMapSkew(map){
    return map.getPitch();
}

//当地图旋转的时候同步标注点的角度
function syncMarkerRotateWhenMapRotateChange(map,markers,rotate){
    for(var x in markers){
        var instance=markers[x];
        var options=instance.options;
        var el=instance.el;

        rotate=rotate || getMapRotate(map);
       
        if(options.autoRotate){
            // marker.setAngle(options.rotate+rotate);
            el.css({
                transform:getRotateAndSkewStyle(getMapSkew(map),options.rotate+rotate)
            });
        }
    }
}

function getRotate(map,rotate){
    return rotate+getMapRotate(map)
}

function getRotateAndSkewStyle(skew,rotate){
    return String.Format('rotateX({0}deg) rotateZ({1}deg)',skew,rotate)
    
}

function getBackgroundImageUrl(src){
    return 'url('+src+')';
}

function getMapLanguage(){
    return wx.getSystemInfoSync().language.indexOf('zh_')==0?'zh_cn':'en'
}

var globalPlaceSearch;
function getPlaceSearch(callback){
    AMap.service(["AMap.PlaceSearch"], function() {
        //构造地点查询类
        globalPlaceSearch = new AMap.PlaceSearch({ 
         
            lang:getMapLanguage(),
            showCover:false,
            autoFitView:false,
            type:'汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
            // extensions:'all'
            // pageSize: 10, // 单页显示结果条数
            // pageIndex: 1, // 页码
            // city: "010", // 兴趣点城市
            // citylimit: true,  //是否强制限制在设置的城市内搜索
            
            // panel: "panel", // 结果列表将在此容器中进行展示。
            // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //关键字查询
        callback(globalPlaceSearch);
    });
}

var str_UPDATE='update';
var str_ALWAYS='ALWAYS';

var API_simplePoint,API_simplePath;

//加载地图高级 api
var stauts_advancedApi=0,callback_advancedApi=[];
function loadMapAdvancedApi(callback){
    
    if(stauts_advancedApi==0){
        stauts_advancedApi=1;
        Common.appendScript("//webapi.amap.com/ui/1.0/main-async.js",function(){
            stauts_advancedApi=2;
            AMapUI.loadUI([
                'ui/misc/PointSimplifier',
                'ui/misc/PathSimplifier',
                ],
            function(simplePoint, simplePath) {
                API_simplePoint=simplePoint;
                API_simplePath=simplePath;

                for(var i=0;i<callback_advancedApi.length;i++){
                    callback_advancedApi[i]();
                }

                callback_advancedApi=0;
                
            });
        });
    }
    else if(stauts_advancedApi==1){
        //api 还在加载中，缓存 callback 回调函数
        callback_advancedApi.push(callback);
    }
    else{
        //api 已经加载完成，直接执行 callback
        callback();
    }
    
}

//根据地图四边 margin 修正地图 center 坐标
function fixCenter(map,lng,lat,topLeftMargin,topRightMargin,bottomRightMargin,bottomLeftMargin,isReduce){
    var topMargin=Math.max(topLeftMargin.y,topRightMargin.y);
    var bottomMargin=Math.max(bottomRightMargin.y,bottomLeftMargin.y);
    var leftMargin=Math.max(topLeftMargin.x,bottomLeftMargin.x);
    var rightMargin=Math.max(topRightMargin.x,bottomRightMargin.x);

    

    var zoom=map.getZoom();

    var pixel = map.lnglatToPixel([lng,lat],zoom);

    var a=2*(isReduce?-1:1);

    pixel.x+=(rightMargin-leftMargin)/a;
    pixel.y+=(bottomMargin-topMargin)/a;

    var lnglat = map.pixelToLngLat(pixel,zoom);

    return{
        longitude:lnglat.lng,
        latitude:lnglat.lat
    }

}

module.exports={
    init:function(callback){

        wx.showLoading({
            title:L('Loading map')
        });

        window.loadMapApiComplete=function(){
            wx.hideLoading();
            callback && callback();
            delete window.loadMapApiComplete;
            
        };

        var plugins="Scale,IndoorMap,Driving,TruckDriving,Walking,Riding,Transfer,CircleEditor,PolyEditor,MarkerClusterer".split(',');

        for(var i=0;i<plugins.length;i++){
            plugins[i]='AMap.'+plugins[i];
        }

        Common.appendScript("//webapi.amap.com/maps?v=1.4.15&plugin="+plugins.join(',')+"&callback=loadMapApiComplete&key="+NBConfig.runtime.web.map.amap.key);

        

        var css=".amap-indoormap-floorbar-control .floor-btn{transform:perspective(500px) translate3d(0,0,0)}"; //地图楼层选择控件，兼容 ios

        Common.appendStyle(css);

    },
    create:function(id,options){


        var Pixel_1=new AMap.Pixel(0, 0);

     
        var event_regionChange,event_tap,event_markerTap,event_calloutTap,event_poiTap,event_updated;
        var regionChange_causedBy;//拖动地图导致(drag)、缩放导致(scale)、调用接口导致(update)---额外增加 rotate 和 skew

        var tileLayer=new AMap.TileLayer();
        var satelliteLayer = new AMap.TileLayer.Satellite();
        var roadNetLayer =  new AMap.TileLayer.RoadNet();
        var buildingLayer=new AMap.Buildings();
        var indoorMapLayer = new AMap.IndoorMap();

        var trafficLayer=new AMap.TileLayer.Traffic({
            'autoRefresh': true,     //是否自动刷新，默认为false
            'interval': 180,         //刷新间隔，默认180s
        });

        var flag_satelliteLayer;
        satelliteLayer.on("complete", function(){
            !flag_satelliteLayer && wx.hideLoading();
            flag_satelliteLayer=true;
        });

        var flag_trafficLayer;
        trafficLayer.on("complete", function(){
            !flag_trafficLayer && wx.hideLoading();
            flag_trafficLayer=true;
        });

        var layers=[tileLayer];

        var enableSatellite=options.enableSatellite;
        if(enableSatellite){
            layers.push(satelliteLayer);
            // layers.push(roadNetLayer);
        }
        else{
            layers.push(indoorMapLayer);
        }

        if(options.enableTraffic){
            
            layers.push(trafficLayer);
        }

        var enable3D=options.enable3D;

        if(enable3D){
            layers.push(buildingLayer);
        }


        var enableZoom=options.enableZoom;

        var default_options={
            showBuildingBlock:false,
            pitchEnable:options.enableOverlooking,      //开启俯视
            zoomEnable:enableZoom,                      //是否支持缩放
            touchZoom:enableZoom, 
            doubleClickZoom:enableZoom,
            scrollWheel:enableZoom,
            dragEnable:options.enableScroll,            //是否支持拖动
            rotateEnable:options.enableRotate,          //是否支持旋转
            pitch:options.skew,                         //倾斜角度
            rotation:options.rotate,                    //旋转角度
            resizeEnable: true,
            showIndoorMap:false,                         //显示室内矢量图
            zoom:options.scale || 16,
            viewMode:'3D',                               //使用3D视图
            layers:layers,
            zooms:[3,19],
            features:['bg','road','point'],//隐藏默认楼块
            lang:getMapLanguage(),
            isHotspot:true
        };

        //设置中心点
        var latitude=options.latitude,longitude=options.longitude;
        if(latitude && longitude){
            default_options.center=[longitude,latitude];
        }

        //图层样式
        var layerStyle=options.layerStyle;
        if(typeof layerStyle =='string'){
            default_options.mapStyle=layerStyle;
        }

        var id_selector='#'+id;

     

        //控制室内地图的楼层选择控件
        var bottomLeftMargin=options.bottomLeftMargin;
        var margin_x=bottomLeftMargin.x=Px(bottomLeftMargin.x);
        var margin_y=bottomLeftMargin.y=Px(bottomLeftMargin.y);

        var css=id_selector+" .amap-indoormap-floorbar-control{bottom:"+(50+margin_y)+"px;right:auto;left:"+(1+margin_x)+"px}";    //楼层控制
        css+=id_selector+" .amap-scalecontrol{bottom:"+(20+margin_y)+"px !important;left:"+(2+margin_x)+"px !important}"; //比例尺
        css+=id_selector+" .amap-logo{bottom:"+(1+margin_y)+"px;left:"+(1+margin_x)+"px}";
        css+=id_selector+" .amap-copyright{display:none !important}";

        var bottomRightMargin=options.bottomRightMargin;
        bottomRightMargin.x=Px(bottomRightMargin.x);
        bottomRightMargin.y=Px(bottomRightMargin.y);

        var topRightMargin=options.topRightMargin;
        topRightMargin.x=Px(topRightMargin.x);
        topRightMargin.y=Px(topRightMargin.y);

        var topLeftMargin=options.topLeftMargin;
        topLeftMargin.x=Px(topLeftMargin.x);
        topLeftMargin.y=Px(topLeftMargin.y);

        
        var map=new AMap.Map(id,default_options);

        var new_center=map.getCenter();
        new_center=fixCenter(map,new_center.lng,new_center.lat,topLeftMargin,topRightMargin,bottomRightMargin,bottomLeftMargin);
        map.setCenter([new_center.longitude,new_center.latitude]);

        var jq_map=$(id_selector);

        Common.appendStyle(css,jq_map[0]);

        //比例尺
        var scale = new AMap.Scale({
            visible: true
        });
        map.addControl(scale);

        var prev_skewValue,prev_rotateValue;

        //由地图 API 自带的事件来触发
        var flag_scaleStart,flag_dragStart;

        var watchLocationId;//监听位置变化的 id
        var myLocation_circle,myLocation_pointer,myLocation_pointer_angle=0,myLocation_el=$(mapCover.template_location),moveToCallback;



        var map_markers={},map_circles={},map_polyline={},map_polygons={};

        var trigger_regionChnage=function(type){

            var center= map.getCenter();
         

            var res= {
                causedBy:regionChange_causedBy,
                detail:{
                    gesture:regionChange_causedBy!=str_UPDATE,
                    rotate:prev_rotateValue,
                    skew:prev_skewValue,
                    type:type,
                    scale:map.getZoom(),
                    latitude:center.getLng(),
                    longitude:center.getLat()
                },
                type:type
            };

            event_regionChange && event_regionChange(res);

        };

        //统一处理触摸开始事件
        var event_touchStartHandler=function(){
          
            prev_skewValue=getMapSkew(map);
        
            prev_rotateValue=map.getRotation();
           
        };

        jq_map.on('mousedown touchstart',event_touchStartHandler);

        var event_touchEndHandler=function(){
            if(!flag_scaleStart && !flag_dragStart && regionChange_causedBy) {
                trigger_regionChnage('end');
                regionChange_causedBy='';
            }
        };

        jq_map.on('mouseup touchend',event_touchEndHandler);

        //统一处理触摸中事件
        var event_touchMoveHandler=function(){

           
           
            var skewValue=getMapSkew(map);
            if(skewValue!=prev_skewValue){
                if(!regionChange_causedBy){
                    regionChange_causedBy='skew';
                    trigger_regionChnage('start');
                }
                else{
                    trigger_regionChnage('ing');
                }

                if(myLocation_pointer){
                    myLocation_el.css({
                        transform:getRotateAndSkewStyle(skewValue,getRotate(map,myLocation_pointer_angle))
                    });
                }
            
                prev_skewValue=skewValue;
            }
    
            var rotateValue=map.getRotation();
            if(rotateValue!=prev_rotateValue){
                if(!regionChange_causedBy){
                    regionChange_causedBy='rotate';
                    trigger_regionChnage('start');
                }
                else{
                    trigger_regionChnage('ing');
                }

             
                myLocation_el.css({
                    transform:getRotateAndSkewStyle(getMapSkew(map),getRotate(map,myLocation_pointer_angle))
                });
                
                syncMarkerRotateWhenMapRotateChange(map,map_markers,rotateValue);
               
                prev_rotateValue=rotateValue;
            }
          
        };

        jq_map.on('mousemove touchmove',event_touchMoveHandler);

        //开始缩放
        map.on('zoomstart',function(){
            flag_scaleStart=true;
            if(!regionChange_causedBy)regionChange_causedBy='scale';
            trigger_regionChnage('start');
        });

        //结束缩放
        map.on('zoomend',function(){
            trigger_regionChnage('end');
            regionChange_causedBy='';
            flag_scaleStart=false;
        });

        //移动开始
        map.on('movestart',function(){
            flag_dragStart=true;
            if(!regionChange_causedBy)regionChange_causedBy='drag';
            trigger_regionChnage('start');
        });

        //移动中
        map.on('mapmove',function(){
            trigger_regionChnage('ing');
        });

        //移动结束
        map.on('moveend',function(){
            trigger_regionChnage('end');
            regionChange_causedBy='';
            flag_dragStart=false;
        });

        //重置大小
        map.on('resize',function(){
            regionChange_causedBy='resize';
            trigger_regionChnage('end');
        });

 
        var myLocation_icon=getBackgroundImageUrl(getImageFullPath(mapCover.icon_location));
        var myLocation_iconWithDirection=getBackgroundImageUrl(getImageFullPath(mapCover.icon_locationWithDirection));
        var timer_myLocation_loading;
       
        

        var active_infoWindow;

        var closeActiveInfoWindow=function(){
            if(active_infoWindow){
                active_infoWindow.infoWindow.setMap(null);
                active_infoWindow.isShowInfoWindow=false;
                active_infoWindow=null;
            }
        };

        var flag_clickHotSpot;

        map.on('click',function(e){
            
            closeActiveInfoWindow();

            if(flag_clickHotSpot){//如果是点击了 poi，则不响应地图的点击事件
                flag_clickHotSpot=false;
                return;
            }
            
            event_tap && event_tap(getMapDetail(e));
        });


        map.on('hotspotclick',function(e){
            flag_clickHotSpot=true;
            event_poiTap && event_poiTap({
                name:e.name,
                id:e.id,
                latitude:e.lnglat.lat,
                longitude:e.lnglat.lng
            })
        });

        var addMarkerClickEvent=function(marker_instance){
            
            var func=marker_instance.markerClick=function (e) {
           
                var extData=marker_instance.options;
               
                var infoWindow=marker_instance.infoWindow;
                var callout=extData.callout;

                if(active_infoWindow ==marker_instance){
                    closeActiveInfoWindow();
                }
                else{
                    closeActiveInfoWindow();
        
                    if(infoWindow && callout.display!=str_ALWAYS){
                        infoWindow.setMap(map);
                        active_infoWindow=marker_instance;
                        marker_instance.isShowInfoWindow=true;
                    }
                }

                event_markerTap && event_markerTap(extData.id,getMapDetail(e));
                
            };

            marker_instance.marker.on('click',func);
        };

        var addInfoWindowClickEvent=function(marker_instance){
            
            var func=marker_instance.infoWindowClick= function (e) {
           
                var extData=marker_instance.options;
                event_calloutTap && event_calloutTap(extData.id,getMapDetail(e));
                
            };

            marker_instance.infoWindow.on('click',func);
        };

        var result={
            map:map,
           
            //属性----------
            center:function(lng,lat){
                var that=this;
                var res= map.getCenter();

                var c_lat=res.getLat();
                var c_lng=res.getLng();

                if(IsSet(lat) && IsSet(lng)){

                    var new_center=fixCenter(map,lng,lat,topLeftMargin,topRightMargin,bottomRightMargin,bottomLeftMargin);
                    lng=new_center.longitude;
                    lat=new_center.latitude;

                    var flag_enable=map.getStatus().dragEnable;

                    if(!flag_enable){
                        that.enableScroll(true);
                    }

                    regionChange_causedBy=str_UPDATE;
                    if(GPS.distance(lat,lng,c_lat,c_lng)>500){//超过 500 米动画移动
                        map.panTo([lng, lat]);
                    }
                    else{
                        map.setCenter([lng, lat]);
                    }

                    if(!flag_enable){
                        that.enableScroll(true);
                    }
                }
                else{

                    var new_center=fixCenter(map,c_lng,c_lat,topLeftMargin,topRightMargin,bottomRightMargin,bottomLeftMargin,true);
                    
                    return{
                        latitude:new_center.latitude,
                        longitude:new_center.longitude
                    }
                }
            },
            scale:function(value){
                var that=this;
                if(IsSet(value)){

                    var flag_enable=map.getStatus().zoomEnable;

                    if(!flag_enable){
                        that.enableZoom(true);
                    }

                    regionChange_causedBy=str_UPDATE;
                    map.setZoom(value);

                    var flag_enable=map.getStatus().pitchEnable;

                    if(!flag_enable){
                        that.enableZoom(true);
                    }
                }
                else{
                    return map.getZoom();
                }
            },
            rotate:function(value){
                var that=this;
                if(IsSet(value)){

                    var flag_enable=map.getStatus().rotateEnable;

                    if(!flag_enable){
                        that.enableRotate(true);
                    }

                    regionChange_causedBy=str_UPDATE;
                    trigger_regionChnage('start');
                    map.setRotation(value);
                    trigger_regionChnage('end');
                    regionChange_causedBy='';

               

                    myLocation_el.css({
                        transform:getRotateAndSkewStyle(getMapSkew(map),getRotate(map,myLocation_pointer_angle))
                    });

                    syncMarkerRotateWhenMapRotateChange(map,map_markers,value);

                    if(!flag_enable){
                        that.enableRotate(false);
                    }
                }
                else{
                    return map.getRotation();
                }
            },
            skew:function(value){
                var that=this;
                if(IsSet(value)){

                    var flag_enable=map.getStatus().pitchEnable;

                    if(!flag_enable){
                        that.enableOverlooking(true);
                    }

                    regionChange_causedBy=str_UPDATE;
                    trigger_regionChnage('start');
                    map.setPitch(value);
                    trigger_regionChnage('end');
                    regionChange_causedBy='';

                    if(myLocation_pointer){
                        myLocation_el.css({
                            transform:getRotateAndSkewStyle(value,getRotate(map,myLocation_pointer_angle))
                        });
                    }
                    
                    syncMarkerRotateWhenMapRotateChange(map,map_markers);

                    if(!flag_enable){
                        that.enableOverlooking(false);
                    }
                }
                else{
                    return getMapSkew(map);
                }
            },
            region:function(value){
                if(value){
                    var northeast=value.northeast;
                    var southwest=value.southwest;
                    var mybounds = new AMap.Bounds([southwest.longitude, southwest.latitude], [northeast.longitude,northeast.latitude]);
                    map.setBounds(mybounds);
                }
                else{
                    var bounds=map.getBounds();
                    var northeast=bounds.northeast;
                    var southwest=bounds.southwest;
                    if(!northeast)northeast=bounds.bounds[3];
                    if(!southwest)southwest=bounds.bounds[0];
                    return {
                        northeast:{
                            latitude:northeast.lat,
                            longitude:northeast.lng
                        },
                        southwest:{
                            latitude:southwest.lat,
                            longitude:southwest.lng
                        }
                    }
                }
            },
            layerStyle:function(key,value){
                if(IsSet(value)){
                    map.setMapStyle(value);
                }
                else{
                    return map.getMapStyle();
                }
            },
            topLeftMargin:function(value){
                topLeftMargin.x=Px(value.x);
                topLeftMargin.y=Px(value.y);
            },
            topRightMargin:function(value){
             
                topRightMargin.x=Px(value.x);
                topRightMargin.y=Px(value.y);
            },
            bottomLeftMargin:function(value){

                

                var x=Px(value.x);
                var y=Px(value.y);

                bottomLeftMargin.x=x;
                bottomLeftMargin.y=y;

                jq_map.children('.amap-logo').css({
                    bottom:(1+y)+'px',
                    left:(1+x)+'px'
                });

                jq_map.children('.amap-controls').children('.amap-scalecontrol').css({
                    bottom:(20+y)+'px !important',
                    left:(2+x)+'px !important'
                });                 //比例尺
                jq_map.children('.amap-controls').children('.amap-indoormap-floorbar-control').css({
                    bottom:(50+y)+'px',
                    left:(1+x)+'px'
                });   //楼层控制

            },
            bottomRightMargin:function(value){
                bottomRightMargin.x=Px(value.x);
                bottomRightMargin.y=Px(value.y);
            },
            markers:function(value){

                value=value||[];

                var ts_update=+new Date();

                var maxWidth=getMaxWidth(jq_map);

                for(var i=0,l=value.length;i<l;i++){
                    var marker=value[i];
                    var marker_id=marker.id;

                    var latitude=marker.latitude;
                    var longitude=marker.longitude;
                    
                    var zIndex=marker.zIndex;
                    var iconPath=marker.iconPath;
                    var rotate=marker.rotate;
                    var alpha=marker.alpha;
                    var width=marker.width;
                    var height=marker.height;
                    var title=marker.title;//点击时显示，callout存在时将被忽略
                    var label=marker.label;
                    var anchor=marker.anchor;
                    var ariaLabel=marker.ariaLabel;
                    var callout=marker.callout;
                    var position=marker.position=[longitude,latitude];
                    var autoRotate=marker.autoRotate;

                    
                    var getInfoWindowOptions=function(){
                        return {
                            map:callout.display==str_ALWAYS?map:null,
                            position:position,
                            content:getCalloutContent(maxWidth,callout),
                            anchor:'bottom-center',
                            offset:new AMap.Pixel(width*(0.5-anchor.x), -height*anchor.y),
                            topWhenClick:true,
                            zIndex:1000000
                        };
                    };

                    var getLableOptions=function(){
                        return {
                            map:map,
                            position:position,
                            content:getLabelContent(maxWidth,label),
                            anchor:'top-center',
                            offset:new AMap.Pixel(width*(0.5-anchor.x), height*(1-anchor.y)),
                            topWhenClick:true,
                            zIndex:1000000
                        };
                    };

                    //todo：先获得图片的尺寸
                    var markerInstance=map_markers[marker_id];
                    if(!markerInstance){//创建

                        var el=$(mapCover.template_marker);
                      
                        el.css({
                            transformOrigin:String.Format('{0}% {1}%',anchor.x*100,anchor.y*100),
                            backgroundImage:getBackgroundImageUrl(iconPath),
                            transform:getRotateAndSkewStyle(autoRotate?getMapSkew(map):0,autoRotate?getRotate(map,rotate):rotate),
                            opacity:alpha,
                            width:width,
                            height:height
                        });
                        el.attr('aria-label',ariaLabel);

                        var marker_options={
                            map:map,
                            position:position,
                            content:el[0],
                            anchor:'top-left',
                            offset:new AMap.Pixel(-width*anchor.x, -height*anchor.y),
                            topWhenClick:true,
                            autoRotation:true
                        };
                        if(IsSet(zIndex))options.zIndex=zIndex;
                        if(IsSet(rotate))options.angle=rotate;
                        if(IsSet(title))options.title=title;

                        markerInstance=map_markers[marker_id]={
                            ts:ts_update,
                            el:el,
                            id:marker_id,
                            options:marker,
                            marker:new AMap.Marker(marker_options),
                           
                        };

                        

                        if(callout.content){

                            markerInstance.infoWindow=new AMap.Marker(getInfoWindowOptions());
                            markerInstance.isShowInfoWindow=callout.display==str_ALWAYS;
                            addInfoWindowClickEvent(markerInstance);
                        }

                        if(label.content){
                            markerInstance.label=new AMap.Marker(getLableOptions());
                        }
                        
                        addMarkerClickEvent(markerInstance);
                    }
                    else{//更新属性
                        var prev_options=markerInstance.options;
                        var _marker=markerInstance.marker;
                        var infoWindow=markerInstance.infoWindow;
                        var _label=markerInstance.label;
                        var el=markerInstance.el;
                        if(!Object.Equals(prev_options.position,position)){
                            _marker.setPosition(position);
                            infoWindow && infoWindow.setPosition(position);
                            _label && _label.setPosition(position);
                        }
                        if(prev_options.zIndex!=zIndex)_marker.setzIndex(zIndex);
                        if(prev_options.ariaLabel !=ariaLabel)el.attr('aria-label',ariaLabel);
                        if(prev_options.alpha!=alpha || 
                            prev_options.width !=width || 
                            prev_options.height !=height || 
                            prev_options.iconPath!=iconPath ||
                            prev_options.rotate !=rotate
                            ){
                                el.css({
                                    backgroundImage:getBackgroundImageUrl(iconPath),
                                    transform:getRotateAndSkewStyle(autoRotate?getMapSkew(map):0,autoRotate?getRotate(map,rotate):rotate),
                                    opacity:alpha,
                                    width:width,
                                    height:height
                                });
                        }
                        if(prev_options.title!=title) _marker.setTitle(title);

                        if(!Object.Equals(prev_options.anchor,anchor) || prev_options.width!=width || prev_options.height!=height){
                            _marker.setOffset(new AMap.Pixel(-width*anchor.x, -height*anchor.y));

                            el.css({
                                transformOrigin:String.Format('{0}% {1}%',anchor.x*100,anchor.y*100)
                            })
                            if(infoWindow){
                                infoWindow.setOffset(new AMap.Pixel(width*(0.5-anchor.x), -height*anchor.y));
                            }
                            if(_label){
                                _label.setOffset(new AMap.Pixel(width*(0.5-anchor.x), height*(1-anchor.y)))
                            }
                        }

                        var prev_callout=prev_options.callout;

                        if(infoWindow && !callout.content){
                            infoWindow.setMap(null);
                            infoWindow.off('click',marker_instance.infoWindowClick);
                            markerInstance.infoWindow=null;
                        }
                        else if(!infoWindow && callout.content){
                            markerInstance.infoWindow=new AMap.Marker(getInfoWindowOptions());
                            addInfoWindowClickEvent(markerInstance);
                        }
                        else if(!Object.Equals(prev_callout,callout)){
                            if(prev_callout.display !=callout.display){
                                infoWindow.setMap(callout.display==str_ALWAYS?map:null);
                                markerInstance.isShowInfoWindow=callout.display==str_ALWAYS;
                            }
                            if(prev_callout.content !=callout.content){
                                infoWindow.setContent(getCalloutContent(maxWidth,callout));
                            }
                        }

                        var prev_label=prev_options.label;
                        if(_label && !label.content){
                            _label.setMap(null);
                            markerInstance.label=null;
                            
                        }
                        else if(!_label && label.content){
                            markerInstance.label=new AMap.Marker(getLableOptions());
                        }
                        else if(!Object.Equals(prev_label,label)){
                          
                            if(prev_label.content !=label.content){
                                _label.setContent(getLabelContent(maxWidth,label));
                            }
                        }

                        markerInstance.ts=ts_update;
                        markerInstance.options=marker;
                    }

                   
                    
                }

                //删除标注点
                for(var x in map_markers){
                    var item=map_markers[x];
                    if(item.ts<ts_update){
                        item.marker.setMap(null);
                        item.infoWindow && item.infoWindow.setMap(null);
                        item.label && item.label.setMap(null);
                        item.marker.off('click',item.markerClick);
                        var infoWindowClick=item.infoWindowClick;
                        if(infoWindowClick)item.infoWindow.off('click',infoWindowClick);
                        delete map_markers[x];
                    }
                }
            },
            circles:function(value){

                value=value||[];

                var ts_update=+new Date();

                for(var i=0,l=value.length;i<l;i++){
                    var circle=value[i];
                    var latitude=circle.latitude;
                    var longitude=circle.longitude;
                    var color=circle.color;
                    var fillColor=circle.fillColor;
                    var radius=circle.radius;
                    var strokeWidth=circle.strokeWidth || 0;
                    var position=circle.position=[longitude,latitude];

                    var color1=Color.ToRgba(color);
                    var color2=Color.ToRgba(fillColor);
                    var _color=Color.ToHex([color1.R,color1.G,color1.B]);
                    var _fillColor=Color.ToHex([color2.R,color2.G,color2.B]);
                    var strokeOpacity=color1.A;
                    var fillOpacity=color2.A;

                    var buildOptions=function(){
                        var res={
                            fillColor:_fillColor,
                            fillOpacity:fillOpacity,
                            strokeColor:_color,
                            strokeOpacity:strokeOpacity,
                            strokeWeight:strokeWidth
                        };
                        return res;
                    };
                   
                    var circleInstance=map_circles[i];
                    if(!circleInstance){//新增
                        map_circles[i]={
                            ts:ts_update,
                            options:circle,
                            circle:new AMap.Circle($.extend(buildOptions(),{
                                map:map,
                                center:position,
                                bubble:true,
                                radius:radius
                            }))
                        }
                    }
                    else{//修改
                        var prev_options=circleInstance.options;
                        var _circle=circleInstance.circle;
                        if(!Object.Equals(prev_options.position,position)){
                            _circle.setPosition(position);
                        }

                        if(prev_options.radius !=radius) _circle.setRadius(radius);
                        if(prev_options.fillColor !=fillColor || prev_options.strokeColor !=strokeColor || prev_options.strokeWidth !=strokeWeight) _circle.setOptions(buildOptions());

                        circleInstance.ts=ts_update;
                        circleInstance.options=circle;
                    }
                }

                //删除
                for(var x in map_circles){
                    var item=map_circles[x];
                    if(item.ts<ts_update){
                        item.circle.setMap(null);
                        delete map_circles[x];
                    }
                }

                event_updated && event_updated();
            },
            polyline:function(value){

                value=value||[];

                var ts_update=+new Date();

                for(var i=0,l=value.length;i<l;i++){
                    var polyline=value[i];
                    var points=polyline.points;
                    var color=polyline.color;
                    var width=polyline.width || 1;
                    var dottedLine=polyline.dottedLine;
                    var arrowLine=polyline.arrowLine;
                    var arrowIconPath=polyline.arrowIconPath;
                    var borderColor=polyline.borderColor;
                    var borderWidth=polyline.borderWidth;

                    var color1=Color.ToRgba(color);
                    var color2=Color.ToRgba(borderColor);
                    var _color=Color.ToHex([color1.R,color1.G,color1.B]);
                    var _borderColor=Color.ToHex([color2.R,color2.G,color2.B]);
                    var strokeOpacity=color1.A;

                    var path=[];
                    for(var j=0,m=points.length;j<m;j++){
                        var point=points[j];
                        path.push([point.longitude,point.latitude]);
                    }

                    var buildOptions=function(){
                        var res={
                            isOutline:borderWidth?true:false,
                            borderWeight:borderWidth,
                            outlineColor:_borderColor,
                            strokeWeight:width,
                            strokeColor:_color,
                            strokeOpacity:strokeOpacity,
                            strokeWeight:width,
                            strokeStyle:dottedLine?'dashed':'solid',
                            showDir:arrowLine?true:false,
                        };

                        //在3D视图下不支持显示方向箭头（自V1.4.0版本参数效果变更）
                        //maybe 以后会支持
                        if(arrowIconPath) res.dirImg=arrowIconPath;
                        return res;
                    };

                   
                    var polylineInstance=map_polyline[i];
                    if(!polylineInstance){//新增
                        map_polyline[i]={
                            ts:ts_update,
                            options:polyline,
                            polyline:new AMap.Polyline($.extend(buildOptions(),{
                                map:map,
                                bubble:true,
                                path:path
                            }))
                        }
                    }
                    else{//修改
                        var prev_options=polylineInstance.options;
                        var _polyline=polylineInstance.polyline;
                        if(!Object.Equals(prev_options.points,points)){
                            _polyline.setPath(path);
                        }

                        if(prev_options.borderWidth !=borderWidth || 
                            prev_options.borderColor !=borderColor || 
                            prev_options.color !=color ||
                            prev_options.width !=width ||
                            prev_options.dottedLine !=dottedLine ||
                            prev_options.arrowLine !=arrowLine ||
                            prev_options.arrowIconPath !=arrowIconPath
                            ) _polyline.setOptions(buildOptions());

                        polylineInstance.ts=ts_update;
                        polylineInstance.options=polyline;
                    }
                }

                //删除
                for(var x in map_polyline){
                    var item=map_polyline[x];
                    if(item.ts<ts_update){
                        item.polyline.setMap(null);
                        delete map_polyline[x];
                    }
                }

                event_updated && event_updated();
            },
            polygons:function(value){

                value=value||[];

                var ts_update=+new Date();

                for(var i=0,l=value.length;i<l;i++){
                    var polygon=value[i];
                    var points=polygon.points;
                    var strokeWidth=polygon.strokeWidth ||1;
                    var strokeColor=polygon.strokeColor;
                    var fillColor=polygon.fillColor;
                    var zIndex=polygon.zIndex;

                    var color1=Color.ToRgba(strokeColor);
                    var color2=Color.ToRgba(fillColor);
                    var _strokeColor=Color.ToHex([color1.R,color1.G,color1.B]);
                    var _fillColor=Color.ToHex([color2.R,color2.G,color2.B]);
                    var strokeOpacity=color1.A;
                    var fillOpacity=color2.A;

                    var path=[];
                    for(var j=0,m=points.length;j<m;j++){
                        var point=points[j];
                        path.push([point.longitude,point.latitude]);
                    }

                    var buildOptions=function(){
                        var res={
                            strokeColor:_strokeColor,
                            strokeWeight:strokeWidth,
                            fillColor:_fillColor,
                            strokeOpacity:strokeOpacity,
                            fillOpacity:fillOpacity
                        };
                        if(IsSet(zIndex))res.zIndex=zIndex;
                        return res;
                    };

                   
                    var polygonInstance=map_polygons[i];
                    if(!polygonInstance){//新增
                        map_polygons[i]={
                            ts:ts_update,
                            options:polygon,
                            polygon:new AMap.Polygon($.extend(buildOptions(),{
                                map:map,
                                bubble:true,
                                path:path
                            }))
                        }
                    }
                    else{//修改
                        var prev_options=polygonInstance.options;
                        var _polygon=polygonInstance.polygon;
                        if(!Object.Equals(prev_options.points,points)){
                            _polygon.setPath(path);
                        }

                        if(prev_options.strokeColor !=strokeColor || 
                            prev_options.strokeWidth !=strokeWidth || 
                            prev_options.fillColor !=fillColor
                            ) _polygon.setOptions(buildOptions());

                        polygonInstance.ts=ts_update;
                        polygonInstance.options=polygon;
                    }
                }

                //删除
                for(var x in map_polygons){
                    var item=map_polygons[x];
                    if(item.ts<ts_update){
                        item.polygon.setMap(null);
                        delete map_polygons[x];
                    }
                }

                event_updated && event_updated();
            },
            includePoints:function(value,padding){
                var path=[];
                //添加隐藏的标注点
                for(var j=0,m=value.length;j<m;j++){
                    var point=value[j];
                    path.push( new AMap.Marker({
                        map:map,
                        position: [point.longitude, point.latitude],
                        content:'<div style="display:none"></div>'
                    }));
                }
                var _padding=[];
                if(!padding || !padding.length)_padding=[10,10,10,10];

                if(padding.length){
                    var padding_0=padding[0];
                    _padding=[padding_0,padding[1] || padding_0,padding[2]||padding_0,padding[3]||padding_0];
                }

                map.setFitView(path,false,_padding);
                //删除隐藏标注点
                for(var i=0,l=path.length;i<l;i++){
                    path[i].setMap(null);
                }
                path=null;
            },
            moveTo:function(lng,lat){
                if(IsSet(lat) && IsSet(lng)){
                    map.panTo([lng, lat]);
                }
                else {
                    if(myLocation_pointer){
                        map.panTo(myLocation_pointer.getPosition())
                    }
                    else{
                        moveToCallback=function(){
                            map.panTo(myLocation_pointer.getPosition())
                        }
                    }
                }
               
            },
            translateMarker:function(OBJECT){
                var markerInstance=map_markers[OBJECT.markerId];
                if(!markerInstance) return;

                var marker=markerInstance.marker;
                var infoWindow=markerInstance.infoWindow;
                var label=markerInstance.label;
                var el=markerInstance.el;

                var marker_options=markerInstance.options;

                //marker 的旋转角度是否跟地图的旋转角度有关
                var autoRotateWhenMapRotateChange=marker_options.autoRotate;

                var autoRotate=OBJECT.autoRotate;
                var destination=OBJECT.destination;

                var dest_position=[destination.longitude,destination.latitude];
                
                var duration=IsSet(OBJECT.duration)? OBJECT.duration:1000;

                var moveEnd=function(){
                    el.css({
                        transform:getRotateAndSkewStyle(autoRotateWhenMapRotateChange?getMapSkew(map):0,autoRotateWhenMapRotateChange?getRotate(map,rotate):rotate)
                    });
                    marker.setPosition(dest_position);
                    
                    infoWindow && infoWindow.setPosition(dest_position);
                    label && label.setPosition(dest_position);

                    //同步数据
                    marker_options.angle=rotate;
                    marker_options.position=dest_position;
                    marker_options.longitude=dest_position[0];
                    marker_options.latitude=dest_position[1];

                    var marker_animation=ToLowerCase(OBJECT.animation);
                    var animation_name='AMAP_ANIMATION_NONE';
                    if(marker_animation=='drop'){
                        animation_name='AMAP_ANIMATION_DROP';
                    }
                    else if(marker_animation=='bounce'){
                        animation_name='AMAP_ANIMATION_BOUNCE';
                    }

                    marker.setAnimation(animation_name);

                    OBJECT.animationEnd && OBJECT.animationEnd();
                };

                if(duration==0){

                    moveEnd();
                    return;
                }

                var start_lng,start_lat,start_rotate;

                var currentPosition=marker.getPosition();
                var current_rotate=start_rotate=marker_options.rotate;

                var rotate=OBJECT.rotate||current_rotate;

                var current_lat=start_lat=currentPosition.lat;
                var current_lng=start_lng=currentPosition.lng;
                
                var stepDuration=17;//步长（ms）
                // if(duration<stepDuration)duration=stepDuration;

                var stepCount=Math.ceil(duration/stepDuration);//向上取证
              

                var step_lat=(destination.latitude-current_lat)/stepCount;
                var step_lng=(destination.longitude-current_lng)/stepCount;

                var step_rotate=(rotate-current_rotate)/stepCount;

                

                var stepProgress=0;

                var flag_pause;


                var move=function(){

                    if(flag_pause) return;

                    
                    if(stepProgress>=stepCount) {
                        //结束
                        // marker.setAngle(rotate+autoRotateWhenMapRotateChange?getMapRotate(map):0);
                        moveEnd();

                        return;
                    }
                    wx.nextTick(function(){
                        
                        var next_lat=current_lat+step_lat;
                        var next_lng=current_lng+step_lng;
                        var next_rotate=current_rotate+step_rotate;

                        marker.setPosition([next_lng,next_lat]);
                        if(autoRotate){
                            //如果 marker 设置了角度和倾角跟随地图，这里角度变化的时候，需要考虑地图角度和倾角的影响
                            //这样视觉上表现为 marker 的角度相对地图永远一致
                            el.css({
                                transform:getRotateAndSkewStyle(autoRotateWhenMapRotateChange?getMapSkew(map):0,autoRotateWhenMapRotateChange?getRotate(map,next_rotate):next_rotate)
                            });
                        }
                        if(label)label.setPosition([next_lng,next_lat]);
                        if(infoWindow && markerInstance.isShowInfoWindow)infoWindow.setPosition([next_lng,next_lat]);

                        current_lat=next_lat;
                        current_lng=next_lng;
                        current_rotate=next_rotate;
                        stepProgress++;

                        move();
                    });
                };

                move();

                return {
                    stop:function(){
                        flag_pause=true;
                        stepProgress=0;
                        current_lat=start_lat;
                        current_lng=start_lng;
                        current_rotate=start_rotate;
                        marker.setPosition([current_lng,current_lat]);
                        
                        el.css({
                            transform:getRotateAndSkewStyle(autoRotateWhenMapRotateChange?getMapSkew(map):0,autoRotateWhenMapRotateChange?getRotate(map,current_rotate):current_rotate)
                        });
                    },
                    pause:function(){
                        flag_pause=true;
                    },
                    start:function(){
                        flag_pause=false;
                        move();
                    }
                }
            },
            //【NewBest 私有 API】简单标注点，支持地图海量标注点的展示
            simplePoint:function(OBJECT){
                loadMapAdvancedApi(function(){
                    var res= new API_simplePoint(OBJECT.options);
                    OBJECT.success(res);
                });
            },
            //【NewBest 私有 API】支持海量的数据点路径绘制
            simplePath:function(OBJECT){
                loadMapAdvancedApi(function(){
                    var res= new API_simplePath(OBJECT.options);
                    OBJECT.success(res);
                });
            },
            //【NewBest 私有 API】路线规划
            routePlan:function(OBJECT){
                // https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
                var type=OBJECT.type; //Driving Truck  Transfer Walking Riding 
                var plan;
                var options=OBJECT.options ||{};
                var origin=OBJECT.origin;
                var destination=OBJECT.destination;
                if(type=='driving'){
                    plan = new AMap.Driving($.extend({
                        policy: AMap.DrivingPolicy.LEAST_TIME,
                        hideMarkers:true,
                        map: map
                    },options));
                }
                else if(type=='truck'){
                    plan = new AMap.TruckDriving($.extend({
                        map: map,
                        policy:0,
                        size:1,
                    },options));
                }
                else if(type=='transfer'){
                    plan = new AMap.Transfer($.extend({
                        map: map,
                        policy: AMap.TransferPolicy.LEAST_TIME
                    },options));
                }
                else if(type=='walking'){
                    plan = new AMap.Walking($.extend({
                        map: map
                    },options));
                }
                else if(type=='riding'){
                    plan = new AMap.Riding($.extend({
                        map: map
                    },options));
                }
                plan.search(new AMap.LngLat(origin.longitude, origin.latitude), new AMap.LngLat(destination.longitude, destination.latitude), function(status, result) {
                    // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                    if (status === 'complete') {
                        OBJECT.success && OBJECT.success();
                    } else {
                        OBJECT.fail && OBJECT.fail({errMsg:result});
                    }
                });
                return plan;
            },
            //【NewBest 私有 API】POI search
            placeSearch:function(OBJECT){
                getPlaceSearch(function(instance){
                    var keyword=OBJECT.keyword;
                    var latitude=OBJECT.latitude;
                    var longitude=OBJECT.longitude;

                    var callback=function(status,result){
                        if(status=='error'){
                            OBJECT.error && OBJECT.error({errMsg:result})
                        }
                        else{
                            
                            var res=[];

                            if(status=='complete'){
                                var pois=result.poiList.pois;
                                for(var i=0;i<pois.length;i++){
                                    var item=pois[i];
                                    res.push({
                                        name:item.name,
                                        address:item.address,
                                        latitude:item.location.lat,
                                        longitude:item.location.lng
                                    })
                                }
                            }
                           
                            OBJECT.success && OBJECT.success({
                                pois:res
                            });
                        }
                    };

                    if(keyword){
                        instance.search(keyword,callback);
                    }
                    else{
                        instance.searchNearBy('',[longitude,latitude],OBJECT.radius || 200,callback);
                    }
                });
            },
            //开关----------
            enable3D:function(value){
                enable3D=value;
                if(!enableSatellite){
                    if(enable3D){
                        map.add(buildingLayer);
                    }
                    else{
                        map.remove(buildingLayer);
                    }
                }
             
            },
            enableOverlooking:function(value){
                map.setStatus({
                    pitchEnable: value
                });
            },
            enableZoom:function(value){
                map.setStatus({
                    zoomEnable: value,
                    touchZoom:value, 
                    doubleClickZoom:value,
                    scrollWheel:value,
                });
            },
            enableScroll:function(value){
                map.setStatus({
                    dragEnable: value
                });
            },
            enableRotate:function(value){
                map.setStatus({
                    rotateEnable: value
                });
            },
            enableSatellite:function(value){
                enableSatellite=value;
                if(value){
                    !flag_satelliteLayer && showLayerLoading();
                    // map.add([satelliteLayer,roadNetLayer]);
                    map.add([satelliteLayer]);
                    if(enable3D)map.remove(buildingLayer);
                    map.remove(indoorMapLayer);
                }
                else{
                    // map.remove([satelliteLayer,roadNetLayer]);
                    map.remove([satelliteLayer]);
                    if(enable3D)map.add(buildingLayer);
                    map.add(indoorMapLayer);
                }

                event_updated && event_updated();
            },
            enableTraffic:function(value){
                if(value){
                    !flag_trafficLayer && showLayerLoading();
                    map.add(trafficLayer);
                }
                else{
                    map.remove(trafficLayer);
                }

                event_updated && event_updated();
            },
            showLocation:function(value){
                if(value){
                    if(watchLocationId) NB.stopWatchLocation(watchLocationId);

                    var flag_loading=true;

                    watchLocationId=NB.watchLocation({
                        type:'gcj02',
                        success:function(res){

                            if(flag_loading){
                                wx.hideLoading();
                                flag_loading=false;
                            }

                           
                            
                            clearTimeout(timer_myLocation_loading);
                            var latitude=res.latitude;
                            var longitude=res.longitude;
                            var accuracy=res.accuracy;
                            var heading=res.heading;
                            var speed=res.speed;

                            var center=[longitude, latitude];

                            if(has_heading)myLocation_pointer_angle=heading;
                            else myLocation_pointer_angle=0;
                            
                            if(!myLocation_pointer){
                                myLocation_circle=new AMap.Circle({
                                    center: center,
                                    radius: accuracy,
                                    strokeColor: "#278bfe",
                                    strokeOpacity: 1,
                                    strokeWeight: 0,
                                    strokeOpacity: 0.8,
                                    fillOpacity: 0.4,
                                    fillColor: '#6abaf8',
                                });

                                var has_heading=!(!IsSet(heading) || isNaN(heading));

                                myLocation_el.css({
                                    backgroundImage:has_heading?myLocation_iconWithDirection:myLocation_icon,
                                    transform:getRotateAndSkewStyle(getMapSkew(map),has_heading?getRotate(map,has_heading):0)
                                });

                                myLocation_pointer=new AMap.Marker({
                                    position: center,
                                    content:myLocation_el[0],
                                    anchor:'center',
                                    offset: Pixel_1,
                                    topWhenClick:true,
                                    zIndex:10000
                                });

                                map.add([myLocation_circle, myLocation_pointer]);
                            }
                            else{
                                //更新当前位置图标信息
                                myLocation_circle.setRadius(accuracy);
                                myLocation_circle.setCenter(center);
                            
                                myLocation_pointer.setPosition(center);
                     
                                myLocation_el.css({
                                    backgroundImage:has_heading?myLocation_iconWithDirection:myLocation_icon,
                                    transform:getRotateAndSkewStyle(getMapSkew(map),has_heading?getRotate(map,has_heading):0)
                                });
                                
                            }
                        
                            if(moveToCallback){
                                moveToCallback();
                                moveToCallback=0;
                            }
                        },
                        fail:function(res){
                            wx.hideLoading();
                            wx.showToast({
                                icon:'none',
                                title:L('Failed to get location, reason: ')+res.errMsg
                            })
                        }
                    });
                    timer_myLocation_loading=setTimeout(function(){
                        wx.showLoading({title:L('Getting your location')});
                    },1000);
                   
                }
                else{
                    watchLocationId && NB.stopWatchLocation(watchLocationId);
                    watchLocationId=0;
                    myLocation_circle.setMap(null);
                    myLocation_circle=null;
                    myLocation_pointer.setMap(null);
                    myLocation_pointer=null;
                }
            },
            //事件----------
            onTap:function(callback){
                event_tap=callback;
            },
            onMarkerTap:function(callback){
                event_markerTap=callback;
            },
            onCalloutTap:function(callback){
                event_calloutTap=callback;
            },
            onPoiTap:function(callback){
                event_poiTap=callback;
            },
            onRegionChange:function(callback){
                event_regionChange=callback;
            },
       
            onUpdated:function(callback){
                
                event_updated=callback;
            },

            onComplete:function(callback){
               
                map.on("complete", function(){
      
                    callback && callback();
                });
            },

            destroy:function(){
                //停止定位
                watchLocationId && NB.stopWatchLocation(watchLocationId);
                //销毁地图
                map.destroy();
            }
        };


        return result;
    },
   
}