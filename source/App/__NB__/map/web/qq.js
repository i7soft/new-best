function IsSet(value){
    return value!==null && typeof value !='undefined'
}

module.exports={
    init:function(){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://map.qq.com/api/js?v=2.exp&key="+NBConfig.runtime.web.map.qq.key;
        document.body.appendChild(script);
    },
    create:function(id,options){

        var default_options={
            mapTypeControl:false,
            panControl:false,
            zoomControl:false,
            scaleControl:false,
            zoom:options.zoom || 16,
            // center:new qq.maps.LatLng(options.latitude, options.longitude)
        };

        var map=new qq.maps.Map(document.getElementById(id),default_options);

        //获取城市列表接口设置中心点
        var citylocation = new qq.maps.CityService({
            complete : function(result){
                map.setCenter(result.detail.latLng);
            }
        });
        //根据用户IP查询城市信息。
        citylocation.searchLocalCity();

        var result={
            map:map,
            center:function(lat,lng){
                if(IsSet(lat) && IsSet(lng)){
                    map.panTo(new qq.maps.LatLng(lat, lng));
                }
                else{
                    return map.getCenter();
                }
            },
            zoom:function(value){
                if(IsSet(value)){
                    map.setZoom(value);
                }
                else{
                    return map.getZoom();
                }
            },
            markers:function(){

            }
        };

        return result;
    },
   
}