var babel=require("@babel/core");
var fs=require('fs');
var path=require('path');
var fsUtils = require("nodejs-fs-utils");

module.exports=function(info,src,dest,parent,name){
    if(info.isDirectory()){

        fs.mkdirSync(dest);

        return;
    }

    if(src.indexOf('.')==0) return;
    
    var dest_dirname=path.dirname(dest);
    if(!fs.existsSync(dest_dirname)){
        fsUtils.mkdirsSync(dest_dirname);
    }

    var extname=path.extname(src);

    if(name.indexOf('.min.')>-1){
        fs.copyFileSync(src,dest);
    }
    else if(name.indexOf('NB.')==0){
        if(fs.existsSync(dest))fs.unlinkSync(dest);
        fs.linkSync(src,dest);
    }
    else if(extname=='.js' || extname=='.wxs'){
        try{
            var res=babel.transformFileSync(src, {
                presets: [
                    "@babel/preset-env",
                    "@babel/preset-flow"
                ],
                babelrc: false,
                configFile: false,
                sourceMaps:'inline',
                // filename:src,
                sourceRoot:parent
            });
            fs.writeFileSync(dest,res.code);
        }
        catch(e){
            console.error(e);
        }
    }
    else if(extname=='.ts'){
        try{
            var res=babel.transformFileSync(src, {
                presets: [
                    "@babel/preset-env",
                    "@babel/preset-flow",
                    "@babel/preset-typescript",
                ],
                babelrc: false,
                configFile: false,
                sourceMaps:'inline',
                // filename:src,
                sourceRoot:parent
            });
            fs.writeFileSync(dest,res.code);
        }
        catch(e){
            console.error(e);
        }
    }
    else {
        fs.copyFileSync(src,dest)
    }
}