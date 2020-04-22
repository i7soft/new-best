var L=require("../../utils/L");
var fecha=require('./DateTimeParseExact');
var TimeSpan=require('./TimeSpan');

// c# 的 datatime
// https://msdn.microsoft.com/en-us/library/system.datetime.aspx

var _timezoneOffset=(new Date()).getTimezoneOffset();//按分钟


function defineProperty(object,props){
    for(var x in props){
        Object.defineProperty(object,x,{
            get:props[x],
            configurable:true
        })
    }
}

function addPrototype(object,props){
    for(var x in props){
        object.prototype[x]=props[x]
    }
}

function addStatic(object,props){
    for(var x in props){
        object[x]=props[x]
    }
}

function getFullFormat(format){

    var lang_dateTime=L('DateTime');

    var shortDate=lang_dateTime.ShortDate;
    var shortTime=lang_dateTime.ShortTime;
    var longDate=lang_dateTime.LongDate;
    var longTime=lang_dateTime.LongTime;

    var res=format || 'G';
    if(res=='d'){
        res=shortDate
    }
    else if(res=='D'){
        res=longDate
    }
    else if(res=='f'){
        res=longDate+' '+shortTime
    }
    else if(res=='F'){
        res=longDate+' '+longTime
    }
    else if(res=='g'){
        res=shortDate+' '+shortTime
    }
    else if(res=='G'){
        res=shortDate+' '+longTime
    }
    else if(res=='m'){
        res=lang_dateTime.m;
    }
    else if(res=='s'){
        res='yyyy-MM-ddTHH:mm:ss';
    }
    else if(res=='t'){
        res=shortTime;
    }
    else if(res=='T'){
        res=longTime;
    }
    else if(res=='u'){
        res="yyyy-MM-dd HH:mm:ssZ";
    }
    else if(res=='U'){
        res=longDate+' HH:mm:ss';
    }
    else if(res=='y'){
        res=lang_dateTime.y;
    }

    return res;
}

/*!
 *方法：isEastEarthTime
 *判断一个时间是在东半球还是西半球
 *@param 
 *@author  Aaron
 */
function isEastEarthTime()
{
    var now = new Date();
    var timeZone = now.getTimezoneOffset();
    if(timeZone < 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isString(s){
    return typeof s=='string'
}

// c# 的 datatime
// https://msdn.microsoft.com/en-us/library/system.datetime.aspx

// options {DateTimeKind:Unspecified|Local|UTC}--指定初始化的时间是本地时间，还是 UTC 时间
var Local='Local',UTC='Utc',Unspecified='Unspecified';

var DateTime=function(input){

    

    var DateTimeKind=Unspecified;//默认是未指定时间是 local 还是 UtC
    var _date=new Date();

    var args=arguments;
    var args_size=args.length;
    if(input.constructor==Date){
        DateTimeKind=args[1] ? ( (isString(args[1])?args[1]: args[1].DateTimeKind) || Local):Local;
        _date=input;
    }
    // DateTime(Int64)
    // 将 DateTime 结构的新实例初始化为指定的刻度数。（精确到毫秒）
    else if(args_size==1){
        _date=new Date(args[0]);
    }
    // DateTime(Int64, DateTimeKind)
    // 将 DateTime 结构的新实例初始化为指定的计时周期数以及协调世界时 (UTC) 或本地时间。
    else if(args_size==2){
        DateTimeKind=(isString(args[1])?args[1]: args[1].DateTimeKind) || Unspecified;
        _date=new Date(args[0]);
    }
    // DateTime(Int32, Int32, Int32)
    // 将 DateTime 结构的新实例初始化为指定的年、月和日。
    else if(args_size==3){
        _date=new Date(args[0],args[1]-1,args[2]);
    }
    // DateTime(Int32, Int32, Int32, Int32, Int32, Int32)
    // 将 DateTime 结构的新实例初始化为指定的年、月、日、小时、分钟和秒。
    else if(args_size==6){
        _date=new Date(args[0],args[1]-1,args[2],args[3],args[4],args[5]);
    }
    // DateTime(Int32, Int32, Int32, Int32, Int32, Int32, Int32)
    // 将 DateTime 结构的新实例初始化为指定的年、月、日、小时、分钟、秒和毫秒。
    // DateTime(Int32, Int32, Int32, Int32, Int32, Int32, DateTimeKind)
    // 将 DateTime 结构的新实例初始化为指定年、月、日、小时、分钟、秒和协调世界时 (UTC) 或本地时间。
    else if(args_size==7){
        var args_6=args[6];
        if(typeof args_6=='number'){
            _date=new Date(args[0],args[1]-1,args[2],args[3],args[4],args[5],args[6]);
        }
        else if(typeof args_6=='object'){
            DateTimeKind=(isString(args[6])?args[6]: args[6].DateTimeKind) || Unspecified;
            _date=new Date(args[0],args[1]-1,args[2],args[3],args[4],args[5]);
        }
       
    }
    // DateTime(Int32, Int32, Int32, Int32, Int32, Int32, Int32, DateTimeKind)
    // 将 DateTime 结构的新实例初始化为指定年、月、日、小时、分钟、秒、毫秒和协调世界时 (UTC) 或本地时间。
    else if(args_size==8){
       
        DateTimeKind=(isString(args[7])?args[7]: args[7].DateTimeKind)|| Unspecified;
        _date=new Date(args[0],args[1]-1,args[2],args[3],args[4],args[5],args[6]);
    }


    var result=this;
    result.Kind=DateTimeKind;
    result._date=_date;

    defineProperty(result,{
        Date:function () {
            return new DateTime(_date.getFullYear(),_date.getMonth()+1,_date.getDate(),0,0,0,{DateTimeKind:DateTimeKind});
        },
        Day:function () {
            return _date.getDate()
        },
        DayOfWeek: function () {
            return _date.getDay()
        },
        DayOfYear:function () {
            return parseInt((_date-new Date(_date.getFullYear(),0,1))/(24*60*60*1000)+1)
        },
        Hour:function () {
            return _date.getHours()
        },
        Millisecond:function () {
            return _date.getMilliseconds()
        },
        Minute:function () {
            return _date.getMinutes()
        },
        Month:function () {
            return _date.getMonth()+1
        },
        Second: function () {
            return _date.getSeconds()
        },
        TimeOfDay:function(){
            return new TimeSpan(_date-new Date(_date.getFullYear(),_date.getMonth()+1,_date.getDate()))
        },
        Year:function () {
            return _date.getFullYear()
        }
    });


    return result;
};

defineProperty(DateTime,{
    // 获取一个 DateTime 对象，该对象设置为此计算机上的当前日期和时间，表示为本地时间。
    Now:function () {
        return new DateTime(new Date())
    },
    // 获取当前日期。
    // 一个对象，设置为当天日期，其时间组成部分设置为 00:00:00。
    Today:function () {
        var today=new Date();
        return new DateTime(today.getFullYear(),today.getMonth()+1,today.getDate(),0,0,0,{DateTimeKind:Local});
    },
    // 获取一个 DateTime 对象，该对象设置为此计算机上的当前日期和时间，表示为协调通用时间 (UTC)。
    UtcNow: function () {
        return new DateTime(new Date(),{DateTimeKind:UTC})
    }
});



// 返回一个新的 DateTime，它将指定 TimeSpan 的值添加到此实例的值上
addPrototype(DateTime,{
    valueOf:function(){
        return +this._date;
    },
    Add:function(value){
        var that=this;
        return new DateTime(+that._date+value,{DateTimeKind:that.Kind})
    },
    // 返回一个新的 DateTime，它将指定的天数加到此实例的值上。
    AddDays:function(value){
        var that=this;
        return new DateTime(+that._date+value*24*60*60*1000,{DateTimeKind:that.Kind})
    },
    // 返回一个新的 DateTime，它将指定的小时数加到此实例的值上。
    AddHours:function(value){
        var that=this;
        return new DateTime(+that._date+value*60*60*1000,current_dtk)
    },
    // 返回一个新的 DateTime，它将指定的毫秒数加到此实例的值上。
    AddMilliseconds:function(value){
        var that=this;
        return new DateTime(+that._date+value,{DateTimeKind:that.Kind})
    },
    // 返回一个新的 DateTime，它将指定的分钟数加到此实例的值上。
    AddMinutes:function(value){
        var that=this;
        return new DateTime(+that._date+value*60*1000,{DateTimeKind:that.Kind})
    },
    // 返回一个新的 DateTime，它将指定的月数加到此实例的值上。
    AddMonths:function(value){
        var that=this;

        var date=new Date(+that._date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
    
        year += Math.floor((month + value) / 12); //计算年
        month = Math.floor((month + value) % 12); //计算月
        if(month<0)month=12+month;
        var d_max = new Date(year,month,0).getDate();  //获取计算后的月的最大天数
        if (day > d_max) {
            day = d_max;
        }
    
        date.setFullYear(year);
        date.setMonth(month-1);
        date.setDate(day);
    
        return new DateTime(date,{DateTimeKind:that.Kind})
    },
    // 返回一个新的 DateTime，它将指定的秒数加到此实例的值上。
    AddSeconds:function(value){
        var that=this;
        return new DateTime(+that._date+value*1000,{DateTimeKind:that.Kind})
    },
    // 返回一个新的 DateTime，它将指定的年份数加到此实例的值上。
    AddYears:function(value){
        var that=this;
        var _date=that._date;
        var new_date=  new DateTime(_date.getFullYear()+value,_date.getMonth()+1,_date.getDate(),_date.getHours(),_date.getMinutes(),_date.getSeconds(),_date.getMilliseconds(),{DateTimeKind:that.Kind})
    },
    Equals:function(t1,t2){
        if(!t2) t2=this;
        return +t1._date==+t2._date && t1.Kind==t2.Kind;
    },
    // 指示此 DateTime 实例是否在当前时区的夏时制范围内。
    IsDaylightSavingTime:function(){
        var now = new Date();
        var start = new Date();
        //得到一年的开始时间
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0); 
        
        var middle = new Date(start.getTime());
        middle.setMonth(6);
        // 如果年始和年中时差相同，则认为此国家没有夏令时
        if ((middle.getTimezoneOffset() - start.getTimezoneOffset()) == 0) 
        {
            return false;
        }
        
        var margin = 0;
        //判断当前用户在东半球还是西半球
        if(isEastEarthTime())
        {
            margin = start.getTimezoneOffset();
        }
        else
        {
            margin = middle.getTimezoneOffset();
        }
        if(now.getTimezoneOffset() == margin)
        {
            return true;
        }
        return false;
        
    },
    // 从此实例中减去指定的时间或持续时间。
    Subtract:function(value){
        var that=this;
        return new DateTime(+that._date-value,{DateTimeKind:that.Kind})
    },
    // 将当前 DateTime 对象的值转换为本地时间。
    ToLocalTime:function(){
        var that=this;
        if(that.Kind==Local){
            return new DateTime(+that._date,Local);
        }
        else{
            return new DateTime(+that._date-_timezoneOffset*60*1000,Local);
        }
    },
    // 将当前 DateTime 对象的值转换为协调世界时 (UTC)。
    ToUniversalTime:function(){
        var that=this;
        if(that.Kind==UTC){
            return new DateTime(+that._date,UTC);
        }
        else{
            return new DateTime(+that._date+_timezoneOffset*60*1000,UTC);
        }
    },
    //默认格式：
    // 格式符	类型	                            示例（System.DateTime.Now）
    // d	    Short date	                    10/12/2002
    // D	    Long date	                    December 10, 2002
    // t	    Short time	                    10:11 PM
    // T	    Long time	                    10:11:29 PM
    // f	    Full date & time	            December 10, 2002 10:11 PM
    // F	    Full date & time (long)	        December 10, 2002 10:11:29 PM
    // g	    Default date & time	            10/12/2002 10:11 PM
    // G	    Default date & time (long)	    10/12/2002 10:11:29 PM
    // M	    Month day pattern	            December 10
    // r	    RFC1123 date string	Tue,        10 Dec 2002 22:11:29 GMT
    // s	    Sortable date string	        2002-12-10T22:11:29
    // u	    Universal sortable, local time	2002-12-10 22:13:50Z
    // U	    Universal sortable, GMT	        December 11, 2002 3:13:50 AM
    // Y	    Year month pattern	            December, 2002

    // yyyy yy MM M MMM MMMM d dd ddd dddd HH H hh h m mm s ss f ff fff zz zzz t tt
    // https://blog.csdn.net/long870294701/article/details/82666208
    ToString:function(format){
        var that=this;
        var res=null;
        if(format=='r'){
            res=that.AddMinutes(-_timezoneOffset)._date.toUTCString()
        }
        else res=fecha.format(that._date, getFullFormat(format));

        return res;
    },
    ToLongDateString:function(){
        return this.ToString('D')
    },
    ToLongTimeString:function(){
        return this.ToString('T')
    },
    ToShortDateString:function(){
        return this.ToString('d')
    },
    ToShortTimeString:function(){
        return this.ToString('t')
    },
});

addStatic(DateTime,{
    // 返回指定年和月中的天数。
    DaysInMonth:function(year,month){
        return new Date(year,month,0).getDate();
    },
    // 返回指定的年份是否为闰年的指示
    IsLeapYear:function(year){
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
    },
    // 将日期和时间的字符串表示形式转换为其等效的 DateTime。
    //parse 之后都是本地时间
    Parse:function(s,format){

        var res;

        if(format){
            res=this.ParseExact(s,format);
        }
        
        if(!res){
            res=Date.parse(s);
            if(isNaN(res) || s.indexOf(':')==-1){
                var origin_s=s;
                s=s.replace('Z','');
    
                var date=new Date();
                var arr=s.split(/[\s+|T]/);
                var year=date.getFullYear(),month=date.getMonth()+1,day=date.getDate();
                var hour=-1,minute=-1,second=-1,millisecond=0;
                for(var i=0;i<arr.length;i++){
                    var item=arr[i];
                    if(item.indexOf('-')>-1 || item.indexOf('/')>-1 ){
                        var arr2=item.split(item.indexOf('-')>-1?'-':'/');
    
                        year=0,month=0,day=0;
                        
                        //获取年份
                        for(var j=0;j<arr2.length;j++){
                            var item_j=arr2[j];
                            if(item_j>1000){
                                year=item_j;
                            }
                            else{
                                if(!month)month=item_j;
                                else day=item_j;
                            }
                        }
    
                       
    
                       
                    }
                    else if(item.indexOf('.')>-1){
                        // console.log(item);
                        var arr1=item.split('.');
                        var arr2=arr1[0].split(':');
                       
                        for(var j=0;j<arr2.length;j++){
                            var item_j=arr2[j];
                            if(hour==-1){
                                hour=item_j;
                            }
                            else if(minute==-1){
                                minute=item_j;
                            }
                            else if(second==-1){
                                second=item_j;
                            }
                        }
    
                        millisecond=arr1[1];
                      
                    }
                    else if(item.indexOf(':')>-1){
                        var arr2=item.split(':');
                        for(var j=0;j<arr2.length;j++){
                            var item_j=arr2[j];
                            if(hour==-1){
                                hour=item_j;
                            }
                            else if(minute==-1){
                                minute=item_j;
                            }
                            else if(second==-1){
                                second=item_j;
                            }
                        }
    
    
                       
                    }
                }
    
                month=month ||1;
                day=day ||1;
                if(hour==-1)hour=0;
                if(minute==-1)minute=0;
                if(second==-1)second=0;
    
                if(year) date.setFullYear(year);
                date.setMonth(month-1);
                date.setDate(day);
    
                date.setHours(hour);
                date.setMinutes(minute);
                date.setSeconds(second);
    
                date.setMilliseconds(millisecond);
    
                res= new DateTime(date);
                if(origin_s.indexOf('Z')>-1){
                    res.AddMinutes(-_timezoneOffset);
                }
                return res;
            }
            else{
                return new DateTime(new Date(s));
            }
        }

        
    },
    ParseExact:function(s,format){

        var res;

        if(format=='r'){
            res= new DateTime(new Date(s));
        }
        else{
            var date=fecha.parse(s,getFullFormat(format));
            if(date){

                res= new DateTime(date);

                if(s.indexOf('Z')>-1){
                    res=res.AddMinutes(-_timezoneOffset);
                }
            }
        }

        return res;
    },
    // 创建新的 DateTime 对象，该对象具有与指定的 DateTime 相同的刻度数，但是根据指定的 DateTimeKind 值的指示，指定为本地时间或协调世界时 (UTC)，或者两者皆否。
    SpecifyKind:function(value,kind){
        return new DateTime(value._date,kind)
    }
});

module.exports=DateTime;
