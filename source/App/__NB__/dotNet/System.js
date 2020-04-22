// var AppDomain= require('./System/AppDomain');
require('./System/Array');
var Convert= require('./System/Convert');
var DateTime=require('./System/DateTime');
var TimeSpan=require('./System/TimeSpan');
var IO= require('./System/IO');
require('./System/String');
var Text= require('./System/Text');
var Uri= require('./System/Uri');


var System={
  Windows:{
    Forms:{

    }
  },
  // AppDomain:AppDomain,
  Convert:Convert,
  IO:IO,
  Text:Text,
  Uri:Uri,
  DateTime:DateTime,
  TimeSpan:TimeSpan,
  Environment:{
    CurrentDirectory:'',//程序所在的目录
  }
};

module.exports=System;