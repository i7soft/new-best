var fs=require('fs');
var path=require('path');
var equal = require('deep-equal');
var fsUtils = require("nodejs-fs-utils");
var sync2es5=require('./utils/sync2es5');

var rootPath=path.join(__dirname,'source');
var destPath=rootPath+'-es5';


function watchAction(name){
    var src=path.join(rootPath,name);
    var dest=path.join(destPath,name);
    var flag_src=fs.existsSync(src);
    var flag_dest=fs.existsSync(dest);


    if(!flag_src){//delete
        if(flag_dest) fsUtils.removeSync(dest);
    }
    else{
        var info = fs.statSync(src);
        if(info.isDirectory()){
            if(!flag_dest){
                fsUtils.mkdirsSync(dest);
            }
        }
        else{
            var dirname=path.dirname(src);
            sync2es5(info,src,dest,dirname,name);
        }
    }
}


var watch = require('watch');
watch.watchTree('./source',{
    ignoreDotFiles:true,
    interval:2
}, function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
      
    } else {
        var filename=f.substr(7);
        console.log(filename);
        watchAction(filename);
      
    }
});
