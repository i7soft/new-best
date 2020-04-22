//内置颜色
var predefinedColor = NB.Color;

//将 颜色字符串转换为 rgba 分量
function convertColor2RGBA(e) {
    var t = null;
    if (null != (t = /^#([0-9|A-F|a-f]{8})$/.exec(e))) {
        var n = parseInt(t[1].slice(0, 2), 16),
            o = parseInt(t[1].slice(2, 4), 16),
            r = parseInt(t[1].slice(4, 6), 16),
            a = parseInt(t[1].slice(6, 8), 16);
        return [n, o, r, a]
    }
    if (null != (t = /^#([0-9|A-F|a-f]{6})$/.exec(e))) {
        var n = parseInt(t[1].slice(0, 2), 16),
            o = parseInt(t[1].slice(2, 4), 16),
            r = parseInt(t[1].slice(4), 16);
        return [n, o, r, 255]
    }
    if (null != (t = /^#([0-9|A-F|a-f]{3})$/.exec(e))) {
        var n = t[1].slice(0, 1),
            o = t[1].slice(1, 2),
            r = t[1].slice(2, 3);
        return n = parseInt(n + n, 16),
            o = parseInt(o + o, 16),
            r = parseInt(r + r, 16), [n, o, r, 255]
    }
    if (null != (t = /^rgb\((.+)\)$/.exec(e)))
        return t[1].split(",").map(function(e) {
            return Math.min(255, parseInt(e.trim()))
        }).concat(255);
    if (null != (t = /^rgba\((.+)\)$/.exec(e)))
        return t[1].split(",").map(function(e, t) {
            return 3 == t ? Math.floor(255 * parseFloat(e.trim())) : Math.min(255, parseInt(e.trim()))
        });
    var i = e.toLowerCase();
    if (HasOwnProperty(predefinedColor, i)) {
        t = /^#([0-9|A-F|a-f]{6,8})$/.exec(predefinedColor[i]);
        var n = parseInt(t[1].slice(0, 2), 16),
            o = parseInt(t[1].slice(2, 4), 16),
            r = parseInt(t[1].slice(4, 6), 16),
            a = parseInt(t[1].slice(6, 8), 16);
        return a = a >= 0 ? a : 255, [n, o, r, a]
    }
    return console.warn("can not convert color from string: " + e),
        [0, 0, 0, 255]
}

//其他颜色转 rgba 分量
predefinedColor.ToArray=convertColor2RGBA;

predefinedColor.ToRgba=function(e){
    var arr=convertColor2RGBA(e);
    return {
        R:arr[0],
        G:arr[1],
        B:arr[2],
        A:parseFloat(arr[3]/255).toFixed(2)
    }
};

//其他颜色转十六进制颜色
predefinedColor.ToHex=function(e){
    if(typeof e =='string'){
        e=convertColor2RGBA(e);
    }

    if(typeof e=='object'){
        var arr=[];
        if(!e.length){
            if(e.hasOwnProperty('R')){
                arr.push(e.R);
            }
            else{
                arr.push(0);
            }
            if(e.hasOwnProperty('G')){
                arr.push(e.G);
            }
            else{
                arr.push(0);
            }
            if(e.hasOwnProperty('B')){
                arr.push(e.B);
            }
            else{
                arr.push(0);
            }
            if(e.hasOwnProperty('A')){
                arr.push(parseInt(e.A*255));
            }
        }
       
    }
    var res='#';
    for(var i=0;i<e.length;i++){
        res+= e[i].toString(16).PadLeft(2,'0');
    }
    
    return res;
};

module.exports=predefinedColor;