
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

function TimeSpan(){

    var value=0;

    var args=arguments;

    if(args.length==1){
        value=args[0];
    }
    else if(args.length==3){
        value=(args[0]*60*60+args[1]*60+args[2])*1000;
    }
    else if(args.length>=4){
        value=(args[0]*24*60*60+args[1]*60*60+args[2]*60+args[3])*1000+(args[4]||0);
    }

    this._value=value;

    var days=parseInt(value/1000/60/60/24);
    var days2=value%(1000*60*60*24);

    var hours=parseInt(days2/1000/60/60);
    var hours_2=days2 % (1000*60*60);

    var minutes=parseInt(hours_2/1000/60);
    var minutes_2=hours_2 % (1000*60);

    var seconds=parseInt(minutes_2/1000);
    var milliseconds=minutes_2%1000;



    defineProperty(this,{
        Days:function () {
            return days
        },
        Hours:function () {
            return hours
        },
        Milliseconds:function () {
            return milliseconds
        },
        Minutes:function () {
            return minutes
        },
        Seconds:function () {
            return seconds
        },
        TotalDays:function(){
            return value/1000/60/60/24
        },
        TotalHours:function(){
            return value/1000/60/60
        },
        TotalMilliseconds:function(){
            return value
        },
        TotalMinutes:function(){
            return value/1000/60
        },
        TotalSeconds:function(){
            return value/1000
        },
    });

    
    return this;
};

addPrototype(TimeSpan,{
    valueOf:function(){
        return this._value;
    },
});

module.exports=TimeSpan;