
// function formatTime(date) {
//     var year = date.getFullYear()
//     var month = date.getMonth() + 1
//     var day = date.getDate()

//     var hour = date.getHours()
//     var minute = date.getMinutes()
//     var second = date.getSeconds()


//     return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// function formatNumber(n) {
//     n = n.toString()
//     return n[1] ? n : '0' + n
// }

function trim(str) {
    return (str || '').replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * 分转元
 * @param {String} val 需要进行转换的数额
 * @return {String} 转换后的金额
 */
function fen2Yuan(val) {
    var result, re = /^[\+|-]?[0-9]+$/;
    if (typeof (val) != "string") {
        val = val.toString()
    }
    return (re.test(val)) ? (parseFloat(val) / 100).toFixed(2) : "0.00";
}

/**
 * 元转分
 * @param {String} val 需要进行转换的数额
 * @return {Int} 转换后的金额
 */
function yuan2Fen(val) {
    var result, re = /^[\+|-]?\d+(\.\d+)?$/;
    if (typeof (val) != "string") {
        val = val.toString()
    }
    return (re.test(val)) ? (parseFloat(val) * 100).toFixed(0) - 0 : 0;
}

/**
 * 检查是否手机
 * @param {String} val
 * @return {Boolean}
 */
function isMobile(val) {
    return /^1\d{10}$/.test(val);
}


function extend(target, source) {
    target = target || {};
    source = source || {};

    for (var key in source) {
        target[key] = source[key];
    }

    return target;
}

/**
 * 获取路径参数
 * names: pathInfo需要指定的名字,否则不提取
 */
function getPathInfo(url, names) {
    // https://wm.shiqiren.com/wxsite/shoplist/typelx/wm/typeid/229?page_title=日日头等舱

    var u = url.split('?');
    var path = u[0] + '/';
    var qs = u[1];
    var obj = {};

    if (names) {
        for (var i = 0; i < names.length; i++) {
            var name = '/' + names[i] + '/';
            var index = path.indexOf(name);

            if (index != -1) {
                var fromIndex = index + name.length;
                var valueIndex = path.indexOf('/', fromIndex);
                var value = path.substring(fromIndex, valueIndex);
                obj[names[i]] = value || '';
            } else {
                obj[names[i]] = '';
            }
        }
    }

    if (qs) {
        var p = qs.split('&');
        for (var i = 0; i < p.length; i++) {
            var item = p[i];

            if (item) {
                item = item.split('=');
                obj[item[0]] = item[1] || '';
            }
        }
    }

    return obj;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }
  
  function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

module.exports = {
    trim: trim,
    extend: extend,
    fen2Yuan: fen2Yuan,
    yuan2Fen: yuan2Fen,
    isMobile: isMobile,
    getPathInfo: getPathInfo,
    ab2str: ab2str,
  str2ab: str2ab
}
