var crypto=require('../../crypto/index');
var base64 = crypto.base64;
var DateTime=require('./DateTime');

var Convert = {
    ToDateTime:function(s,format) {
		return DateTime.Parse(value,format);
    },
    FromBase64String:function(s) {
        return base64.toByteArray(s.Replace("\n", ""));
    },
	//options:
	// Base64FormattingOptions:
    //1 InsertLineBreaks  在字符串表示形式中每隔 76 个字符插入分行符
    //0 None None 	      不要在字符串表示形式中每隔 76 个字符插入分行符
    ToBase64String:function(inArray, offset, length, options) {
        options = options || {};
        offset=offset||0;
        length=length||inArray.length;
		var Base64FormattingOptions=options.Base64FormattingOptions ||'None';
        var subArray = inArray.slice(offset, offset + length);
        var result = base64.fromByteArray(subArray);
        var size = result.length;
        if (size > 76 || Base64FormattingOptions=='InsertLineBreaks') {
            var arr = [];
            for (var i = 0; i < size; i = i + 76) {
                arr.push(result.substr(i, 76));
            }
            result = arr.join("\n");
        }
        return result;
    },
    // //十六进制的颜色转 rgb 分量
    // HexColorToRgb:function(input) {
    //     var sColor = input.toLowerCase();
    //     if (sColor && reg.test(sColor)) {
    //         if (sColor.length === 4) {
    //             var sColorNew = "#";
    //             for (var i = 1; i < 4; i += 1) {
    //                 sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
    //             }
    //             sColor = sColorNew;
    //         }
    //         //处理六位的颜色值  
    //         var sColorChange = [];
    //         for (var i = 1; i < 7; i += 2) {
    //             sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    //         }
    //         return {
    //             R:sColorChange[0],
    //             G:sColorChange[1],
    //             B:sColorChange[2]
    //         };
    //     } else {
    //         return null;
    //     }
    // },
    // //十六进制的字符串转 ascii 字符串
    // HexStringToAscii:function(strInput) {
    //     // var strInput = $("#text_input").val();
    //     var nInputLength = strInput.length;
    //     if (nInputLength % 2 == 0) //当输入够偶数位；
    //     {
    //         var StrHex = "";
    //         for (var i = 0; i < nInputLength; i = i + 2) {
    //             var str = strInput.substr(i, 2);
    //             //16进制；
    //             //StrHex = StrHex + .toString(16);
    //             var n = parseInt(str, 16);
    //             //10进制；
    //             StrHex = StrHex + String.fromCharCode(n);
    //         }
    //         return StrHex;
    //     }
    // },
    // //ascii 字符串转十六进制字符串
    // AsciiToHexString:function(str) {
    //     var val = "";
    //     // var str = $("#text_input").val();
    //     for (var i = 0; i < str.length; i++) {
    //         if (val == "") val = str.charCodeAt(i).toString(16); else val += str.charCodeAt(i).toString(16);
    //     }
    //     return val;
    // }
};

module.exports = Convert;