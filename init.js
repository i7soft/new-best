var fs=require('fs');
var path=require('path');
var platform_path='./platform';
var platform=fs.readdirSync(platform_path);
var plist = require('plist');
var xml2js = require('xml-js');
require('./source/NB.config.js');

var sync2es5=require('./utils/sync2es5');


function readDirSync(path,path2,func){
	var pa = fs.readdirSync(path);
	pa.forEach(function(ele,index){
		var info = fs.statSync(path+"/"+ele)	
		if(info.isDirectory()){
            func(info,path+"/"+ele,path2+"/"+ele);
			readDirSync(path+"/"+ele,path2+"/"+ele,func);
		}else{
            
            func(info,path+"/"+ele,path2+"/"+ele,path,ele)
		}	
	})
}



if(!fs.existsSync(path.join(__dirname,'source-es5'))){
    fs.mkdirSync(path.join(__dirname,'source-es5'));


    readDirSync(path.join(__dirname,'source'),path.join(__dirname,'source-es5'),function(info,src,dest,parent,name){

        sync2es5(info,src,dest,parent,name);
        
    });
}


platform.forEach(item => {

    if(item.indexOf('.')==0) return;

    var sdk_path=path.join(platform_path,item,'NB.sdk.js');
    var config_path=path.join(platform_path,item,'NB.config.js');
    var logo_path=path.join(platform_path,item,'logo.png');

    if(fs.existsSync(sdk_path)){
        fs.unlinkSync(sdk_path);
    }

    if(fs.existsSync(config_path)){
        fs.unlinkSync(config_path);
    }

    if(fs.existsSync(logo_path)){
        fs.unlinkSync(logo_path);
    }

   
    fs.linkSync(__dirname+'/source/NB.sdk.js',sdk_path);

    fs.linkSync(__dirname+'/source/NB.config.js',config_path);

    fs.linkSync(__dirname+'/source/logo.png',logo_path);

    if(fs.existsSync(path.join(platform_path,item,'App'))){
        fs.unlinkSync(path.join(platform_path,item,'App'));
    }

    if(item!='mobileReactNative'){
        fs.symlinkSync(__dirname+'/source-es5/App',path.join(platform_path,item,'App'));
    }
    
    
});

console.log('success');