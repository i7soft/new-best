var aaa = 10;

module.exports = {
  bbb:1,
  aaa:function(){
    console.log(this.bbb); this.bbb++;
  },
  /**
 * 毫秒转换友好的显示格式
 * 输出格式：21小时28分钟15秒
 * @param  {[type]} time [description]
 * @return {[type]}      [description]
 */
  friendlyTime:function(time) 
{
  // 获取当前时间戳
  var currentTime = parseInt(new Date().getTime() / 1000);
  var diffTime = currentTime - time;
  var second = 0;
  var minute = 0;
  var hour = 0;
  if (null != diffTime && "" != diffTime) {
    if (diffTime > 60 && diffTime < 60 * 60) {
      diffTime = parseInt(diffTime / 60.0) + "分钟" + parseInt((parseFloat(diffTime / 60.0) - parseInt(diffTime / 60.0)) * 60) + "秒";
    }
    else if (diffTime >= 60 * 60 && diffTime < 60 * 60 * 24) {
      diffTime = parseInt(diffTime / 3600.0) + "小时" + parseInt((parseFloat(diffTime / 3600.0) -
        parseInt(diffTime / 3600.0)) * 60) + "分钟" +
        parseInt((parseFloat((parseFloat(diffTime / 3600.0) - parseInt(diffTime / 3600.0)) * 60) -
          parseInt((parseFloat(diffTime / 3600.0) - parseInt(diffTime / 3600.0)) * 60)) * 60) + "秒";
    }
    else {
      //超过1天
      var date = new Date(parseInt(time) * 1000);
      diffTime = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate()+'日';
      //diffTime = parseInt(diffTime) + "秒";
    }
  }
  return diffTime;
},
    /**
     * 格式化日期文本为日期对象
     *
     * @method str2Date
     * @param {String} date 文本日期
     * @param {String} [p:%Y-%M-%d %h:%m:%s] 文本日期的格式
     * @return {Date}
     */
    str2Date: function (date, p) {
        p = p || '%Y-%M-%d %h:%m:%s';
        p = p.replace(/\-/g, '\\-');
        p = p.replace(/\|/g, '\\|');
        p = p.replace(/\./g, '\\.');
        p = p.replace(/\+/g, '\\+');
        p = p.replace('%Y', '(\\d{4})');
        p = p.replace('%M', '(\\d{1,2})');
        p = p.replace('%d', '(\\d{1,2})');
        p = p.replace('%h', '(\\d{1,2})');
        p = p.replace('%m', '(\\d{1,2})');
        p = p.replace('%s', '(\\d{1,2})');

        var regExp = new RegExp('^' + p + '$'),
            group = regExp.exec(date),
            Y = (group[1] || 0) - 0,
            M = (group[2] || 1) - 1,
            d = (group[3] || 0) - 0,
            h = (group[4] || 0) - 0,
            m = (group[5] || 0) - 0,
            s = (group[6] || 0) - 0;

        return new Date(Y, M, d, h, m, s);
    },

    /**
     * 格式化日期为指定的格式
     *
     * @method date2Str
     * @param {Date} date
     * @param {String} p 输出格式, %Y/%M/%d/%h/%m/%s的组合(%YY/%MM/%dd/%hh/%mm/%ss为两位数)
     * @return {String}
     */
    date2Str: function (date, p) {
        var Y = date.getFullYear(),
            M = date.getMonth() + 1,
            d = date.getDate(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();

        var MM = (M < 10) ? ('0' + M) : M;
        var dd = (d < 10) ? ('0' + d) : d;
        var hh = (h < 10) ? ('0' + h) : h;
        var mm = (m < 10) ? ('0' + m) : m;
        var ss = (s < 10) ? ('0' + s) : s;

        p = p || '%YY-%MM-%dd %hh:%mm:%ss';

        p = p.replace(/%YY/g, Y);
        p = p.replace(/%MM/g, MM).replace(/%M/g, M);
        p = p.replace(/%dd/g, dd).replace(/%d/g, d);
        p = p.replace(/%hh/g, hh).replace(/%h/g, h);
        p = p.replace(/%mm/g, mm).replace(/%m/g, m);
        p = p.replace(/%ss/g, ss).replace(/%s/g, s);
        return p;
    },

    /**
     * 日期比较(d1 - d2)
     *
     * @method dateDiff
     * @param {Date} d1
     * @param {Date} d2
     * @param {String} [cmpType:ms] 比较类型, 可选值: Y/M/d/h/m/s/ms -> 年/月/日/时/分/妙/毫秒
     * @return {Float}
     */
    dateDiff: function (d1, d2, cmpType) {
        var diff = 0;
        switch (cmpType) {
            case 'Y':
                diff = d1.getFullYear() - d2.getFullYear();
                break;
            case 'M':
                diff = (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
                break;
            case 'd':
                diff = (d1 - d2) / 86400000;
                break;
            case 'h':
                diff = (d1 - d2) / 3600000;
                break;
            case 'm':
                diff = (d1 - d2) / 60000;
                break;
            case 's':
                diff = (d1 - d2) / 1000;
                break;
            default:
                diff = d1 - d2;
                break;
        }
        return diff;
    },
    /**
     * 将毫秒数转化成xx天xx时xx分xx秒
     * @param time
     */
    formatMillisecond: function (time) {
        return {
            date: parseInt(time / 86400000),
            hour: parseInt(time % 86400000 / 3600000),
            minute: parseInt(time % 3600000 / 60000),
            second: parseInt(time % 60000 / 1000)
        }
    },
    /**
     * 是否闰年
     * @param {Date|Int} year 日期对象或者年份
     * @return {Boolean}
     */
    isLeapYear: function (year) {
        if ($.type(year) == 'date') {
            year = year.getFullYear();
        }

        return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    }
};