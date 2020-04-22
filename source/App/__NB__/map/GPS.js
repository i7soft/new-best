var PI = 3.14159265358979324,x_pi = 3.14159265358979324 * 3000.0 / 180.0;

var delta = function (lat, lng) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
    var dLat = transformLat(lng - 105.0, lat - 35.0);
    var dLon = transformLon(lng - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * PI;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
    return {'lat': dLat, 'lng': dLon};
};

var rectangle= function(lng1, lat1, lng2, lat2) {
    return {
        west : Math.min(lng1, lng2),
        north : Math.max(lat1, lat2),
        east : Math.max(lng1, lng2),
        south : Math.min(lat1, lat2)
    };
};
var isInRect= function(rect, lng, lat) {
    return rect.west <= lng && rect.east >= lng && rect.north >= lat && rect.south <= lat;
};

var isInChina=function(lat, lng) {
    //China region - raw data
    //http://www.cnblogs.com/Aimeast/archive/2012/08/09/2629614.html
    var region = [
        rectangle(79.446200, 49.220400, 96.330000,42.889900),
        rectangle(109.687200, 54.141500, 135.000200, 39.374200),
        rectangle(73.124600, 42.889900, 124.143255, 29.529700),
        rectangle(82.968400, 29.529700, 97.035200, 26.718600),
        rectangle(97.025300, 29.529700, 124.367395, 20.414096),
        rectangle(107.975793, 20.414096, 111.744104, 17.871542)
    ];

    //China excluded region - raw data
    var exclude = [
        rectangle(119.921265, 25.398623, 122.497559, 21.785006),
        rectangle(101.865200, 22.284000, 106.665000, 20.098800),
        rectangle(106.452500, 21.542200, 108.051000, 20.487800),
        rectangle(109.032300, 55.817500, 119.127000, 50.325700),
        rectangle(127.456800, 55.817500, 137.022700, 49.557400),
        rectangle(131.266200, 44.892200, 137.022700, 42.569200),

        // hongkong
        rectangle(113.837108, 22.44151, 114.408397, 22.167709)
    ];
    for (var i = 0; i < region.length; i++)
        if (isInRect(region[i], lng, lat))
        {
            for (var j = 0; j < exclude.length; j++)
                if (isInRect(exclude[j], lng, lat))
                    return false;
            return true;
        }
    return false;
};

var transformLat = function (x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret;
};
var transformLon = function (x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
};

// WGS-84：是国际标准，GPS坐标（Google Earth使用、或者GPS模块）
// GCJ-02：中国坐标偏移标准，Google Map、高德、腾讯使用
// BD-09：百度坐标偏移标准，Baidu Map使用

module.exports = {


    wgs84_gcj02 : function (wgsLat, wgsLon) {
       
        if (!isInChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lng': wgsLon};

        var d = delta(wgsLat, wgsLon);
        return {'lat' : parseFloat(wgsLat) + parseFloat(d.lat),'lng' : parseFloat(wgsLon) + parseFloat(d.lng)};
    },
 
    gcj02_wgs84 : function (gcjLat, gcjLon) {
        if (!isInChina(gcjLat, gcjLon))
        
            return {'lat': gcjLat, 'lng': gcjLon};
        
        var d = delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lng': gcjLon - d.lng};
    },


    gcj02_bd09 : function (gcjLat, gcjLon) {
        var x = gcjLon, y = gcjLat;  
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);  
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);  
        bdLon = z * Math.cos(theta) + 0.0065;  
        bdLat = z * Math.sin(theta) + 0.006; 
        return {'lat' : bdLat,'lng' : bdLon};
    },

    bd09_gcj02 : function (bdLat, bdLon) {
        var x = bdLon - 0.0065, y = bdLat - 0.006;  
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);  
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);  
        var gcjLon = z * Math.cos(theta);  
        var gcjLat = z * Math.sin(theta);
        return {'lat' : gcjLat, 'lng' : gcjLon};
    },

    // two point's distance
    distance : function (latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * PI / 180.) * Math.cos(latB * PI / 180.) * Math.cos((lonA - lonB) * PI / 180);
        var y = Math.sin(latA * PI / 180.) * Math.sin(latB * PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        var distance = alpha * earthR;
        return distance;
    },
    
    isInChina:isInChina
};

