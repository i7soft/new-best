
var L=require("../../utils/L");

var lang_dateTime=L('DateTime');

/**
 * Parse or format dates
 * @class fecha
 */
var fecha = {};
var token = /d{1,4}|M{1,4}|yy(?:yy)?|f{1,3}|Do|z{2,3}|t{1,2}|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
var twoDigits = '\\d\\d?';
var threeDigits = '\\d{3}';
var fourDigits = '\\d{4}';
var word = '[^\\s]+';
var literal = /\[([^]*?)\]/gm;
var noop = function () {
};

function regexEscape(str) {
    return str.replace( /[|\\{()[^$+*?.-]/g, '\\$&');
}


function monthUpdate(arrName) {
    return function (d, v, i18n) {
        var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
        if (~index) {
        d.month = index;
        }
    };
}

function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
        val = '0' + val;
    }
    return val;
}



var dayNames = lang_dateTime.weekdays;
var monthNames = lang_dateTime.months;
var monthNamesShort = lang_dateTime.monthsShort;
var dayNamesShort = lang_dateTime.weekdaysShort;
fecha.i18n = {
dayNamesShort: dayNamesShort,
dayNames: dayNames,
monthNamesShort: monthNamesShort,
monthNames: monthNames,
amPm: [lang_dateTime.AM, lang_dateTime.PM],
amPmShorts:[lang_dateTime.A,lang_dateTime.P],
DoFn: function DoFn(D) {
    return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
}
};

var formatFlags = {
    d: function(dateObj) {
        return dateObj.getDate();
    },
    dd: function(dateObj) {
        return pad(dateObj.getDate());
    },
    Do: function(dateObj, i18n) {
        return i18n.DoFn(dateObj.getDate());
    },
    d: function(dateObj) {
        return dateObj.getDate();
    },
    // dd: function(dateObj) {
    //     return pad(dateObj.getDay());
    // },
    ddd: function(dateObj, i18n) {
        return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function(dateObj, i18n) {
        return i18n.dayNames[dateObj.getDay()];
    },
    M: function(dateObj) {
        return dateObj.getMonth() + 1;
    },
    MM: function(dateObj) {
        return pad(dateObj.getMonth() + 1);
    },
    MMM: function(dateObj, i18n) {
        return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function(dateObj, i18n) {
        return i18n.monthNames[dateObj.getMonth()];
    },
    yy: function(dateObj) {
        return pad(String(dateObj.getFullYear()), 4).substr(2);
    },
    yyyy: function(dateObj) {
        return pad(dateObj.getFullYear(), 4);
    },
    h: function(dateObj) {
        return dateObj.getHours() % 12 || 12;
    },
    hh: function(dateObj) {
        return pad(dateObj.getHours() % 12 || 12);
    },
    H: function(dateObj) {
        return dateObj.getHours();
    },
    HH: function(dateObj) {
        return pad(dateObj.getHours());
    },
    m: function(dateObj) {
        return dateObj.getMinutes();
    },
    mm: function(dateObj) {
        return pad(dateObj.getMinutes());
    },
    s: function(dateObj) {
        return dateObj.getSeconds();
    },
    ss: function(dateObj) {
        return pad(dateObj.getSeconds());
    },
    f: function(dateObj) {
        return Math.round(dateObj.getMilliseconds() / 100);
    },
    ff: function(dateObj) {
        return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    fff: function(dateObj) {
        return pad(dateObj.getMilliseconds(), 3);
    },
    a: function(dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function(dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
    },
    zz: function(dateObj) {
        var o = dateObj.getTimezoneOffset();

        return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) + Math.abs(o) % 60, 2);
    },
    zzz:function(dateObj){
        var o = dateObj.getTimezoneOffset();
        return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) + Math.abs(o) % 60, 2)+'.00';
    },
    tt:function(dateObj,i18n){
        return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    t:function(dateObj,i18n){
        return dateObj.getHours() < 12 ? i18n.amPmShorts[0] : i18n.amPmShorts[1];
    }
};

var parseFlags = {
    d: [twoDigits, function (d, v) {
        d.day = v;
    }],
    Do: [twoDigits + word, function (d, v) {
        d.day = parseInt(v, 10);
    }],
    M: [twoDigits, function (d, v) {
        d.month = v - 1;
    }],
    yy: [twoDigits, function (d, v) {
        var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
        d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function (d, v) {
        d.hour = v;
    }],
    m: [twoDigits, function (d, v) {
        d.minute = v;
    }],
    s: [twoDigits, function (d, v) {
        d.second = v;
    }],
    yyyy: [fourDigits, function (d, v) {
        d.year = v;
    }],
    f: ['\\d', function (d, v) {
        d.millisecond = v * 100;
    }],
    ff: ['\\d{2}', function (d, v) {
        d.millisecond = v * 10;
    }],
    fff: [threeDigits, function (d, v) {
        d.millisecond = v;
    }],
    // d: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function (d, v, i18n) {
        var val = v.toLowerCase();
        if (val === i18n.amPm[0] || val === i18n.amPmShorts[0]) {
            d.isPm = false;
        } else if (val === i18n.amPm[1] || val === i18n.amPmShorts[1]) {
            d.isPm = true;
        }
    }],
    zz: ['[^\\s]*?[\\+\\-]\\d\\d', function (d, v) {
       
        var parts = (v + '').match(/([+-]|\d\d+)/gi), minutes;

        if (parts) {
            minutes = +(parts[1] * 60) + parseFloat(parts[2], 10);
            d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
        }
    }],
    zzz: ['[^\\s]*?[\\+\\-]\\d\\d.:?\\d\\d', function (d, v) {
        
        var parts = (v + '').match(/([+-]|\d\d+\.\d{1,2})/gi), minutes;

        if (parts) {
            minutes = +(parts[1] * 60) + parseFloat(parts[2], 10);
            d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
        }
    }]
};
parseFlags.dd = parseFlags.d;
parseFlags.dddd = parseFlags.ddd;
// parseFlags.DD = parseFlags.D;
parseFlags.mm = parseFlags.m;
parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
parseFlags.MM = parseFlags.M;
parseFlags.ss = parseFlags.s;
parseFlags.A =parseFlags.t=parseFlags.tt= parseFlags.a;


// Some common format strings
fecha.masks = {
default: 'yyyy/M/d H:mm:ss',
// shortDate: 'M/D/YY',
// mediumDate: 'MMM D, YYYY',
// longDate: 'MMMM D, YYYY',
// fullDate: 'dddd, MMMM D, YYYY',
// shortTime: 'HH:mm',
// mediumTime: 'HH:mm:ss',
// longTime: 'HH:mm:ss.SSS'
};

/***
    * Format a date
    * @method format
    * @param {Date|number} dateObj
    * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
    */
fecha.format = function (dateObj, mask, i18nSettings) {

    

    var i18n = i18nSettings || fecha.i18n;

    if (typeof dateObj === 'number') {
        dateObj = new Date(dateObj);
    }

    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
        throw new Error('Invalid Date in fecha.format');
    }

    mask = fecha.masks[mask] || mask || fecha.masks['default'];

    var literals = [];

    // Make literals inactive by replacing them with ??
    mask = mask.replace(literal, function($0, $1) {
        literals.push($1);
        return '@@@';
    });
    // Apply formatting rules
    mask = mask.replace(token, function ($0) {
        return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
    // Inline literal values back into the formatted value
    return mask.replace(/@@@/g, function() {
        return literals.shift();
    });
};

/**
    * Parse a date string into an object, changes - into /
    * @method parse
    * @param {string} dateStr Date string
    * @param {string} format Date parse format
    * @returns {Date|boolean}
    */
fecha.parse = function (dateStr, format, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof format !== 'string') {
        throw new Error('Invalid format in fecha.parse');
    }

    format = fecha.masks[format] || format;

    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
        return null;
    }

    var dateInfo = {};
    var parseInfo = [];
    var literals = [];
    format = format.replace(literal, function($0, $1) {
        literals.push($1);
        return '@@@';
    });
    var newFormat = regexEscape(format).replace(token, function ($0) {
        
        if (parseFlags[$0]) {
        var info = parseFlags[$0];
        parseInfo.push(info[1]);
        return '(' + info[0] + ')';
        }

        return $0;
    });
    newFormat = newFormat.replace(/@@@/g, function() {
        return literals.shift();
    });
    
    var matches = dateStr.match(new RegExp(newFormat, 'i'));
    if (!matches) {
        return null;
    }

    for (var i = 1; i < matches.length; i++) {
        parseInfo[i - 1](dateInfo, matches[i], i18n);
    }

    var today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
        dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
        dateInfo.hour = 0;
    }

    var date;
    if (dateInfo.timezoneOffset != null) {
        dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
        date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
        date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
};

module.exports=fecha;