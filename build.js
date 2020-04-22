const fs = require("fs");
const path = require("path");
var minifyHtml = require('html-minifier').minify;
var UglifyJS = require("uglify-js");
var CleanCSS = require('clean-css');
var babel = require("@babel/core");
const mime = require('mime');
var Terser = require("terser");
var fsUtils = require("nodejs-fs-utils");

function readDirSync(path,func){
	var pa = fs.readdirSync(path);
	pa.forEach(function(ele,index){
		var info = fs.statSync(path+"/"+ele)	
		if(info.isDirectory()){
			// console.log("dir: "+ele)
			readDirSync(path+"/"+ele,func);
		}else{
            // console.log("file: "+ele)
            func(path+"/"+ele,ele)
		}	
	})
}

var app_cache='CACHE MANIFEST\n'+'# '+(+new Date())+'\n';

//递归创建目录 同步方法  
function mkdirsSync(dirname) {  
    //console.log(dirname);  
    if (fs.existsSync(dirname)) {  
        return true;  
    } else {  
        if (mkdirsSync(path.dirname(dirname))) {  
            fs.mkdirSync(dirname);  
            return true;  
        }  
    }  
} 

function build_app( deviceType){
    mkdirsSync(path.join(__dirname,'release','App'));
    //移除 debug 标记
    var deleteDebugCode=function(code){
      var repone = /\/\/if DEBUG[\s\S]*?\/\/endif/ig;
      return code.replace(repone,"");
    };
  
    var appRootPath=path.join(__dirname,'source','App');

    var result='';// 'var documentList=global.documentList;\n';

    readDirSync(appRootPath,function(item,fileName){
        if(item.indexOf('.DS_Store')>-1) return;

        var extname=path.extname(item);

        if(deviceType===''){
            if(fileName.indexOf('.pad.')>-1 || fileName.indexOf('.pc.')>-1 ){
                return;
            }
        }
        else if(deviceType=='pad'){
            if(fileName.indexOf('.pc.')>-1 ){
                return;
            }

            if(extname=='.wxml' && fs.existsSync(item.replace(extname,'.'+deviceType+extname))){
                return;
            }
        }
        else if(deviceType=='pc'){
            if(fileName.indexOf('.pad.')>-1 ){
                return;
            }

            if(extname=='.wxml' && fs.existsSync(item.replace(extname,'.'+deviceType+extname))){
                return;
            }
        }
            // console.log(item);
        try{
            // var I7_Core=fs.readFileSync(item);console.log(I7_Core);
            var add_code=true;
            
            var fileConetent='';
            var key=item.replace(appRootPath,'').replace('/','');
            // console.log(key);
            // if(fileName=='NB.config.js'){
            //     var I7_Core=fs.readFileSync(item,'utf-8');
            //     fs.writeFileSync(path.join(__dirname,'NB.config.js'), I7_Core);
            //     return;
            // }
            // else 
            if(extname=='.json'){
                var I7_Core=fs.readFileSync(item,'utf-8');
                // console.log(I7_Core);
                if(I7_Core){
                    I7_Core = JSON.parse(I7_Core);
                    fileConetent=JSON.stringify(I7_Core);
                }
                else{
                    fileConetent="{}";
                }
            }
            else if(extname=='.js' || extname=='.wxs'){
                
                var I7_Core=fs.readFileSync(item,'utf-8');
                // I7_Core='var _=function(require,module,exports){\n'+ I7_Core+'\n}';
                if(item.indexOf('.min.')==-1){
                    I7_Core=deleteDebugCode(I7_Core);
                 
                    // var bbb=babel.transform(I7_Core,{presets: ['env'],compact: false});
                    // var I7_Core=bbb.code;
                    // var _result=UglifyJS.minify(I7_Core, {
                    //     sourceMap:false,
                    //     compress: {
                    //         unused: true,
                    //         toplevel:true,
                    //         evaluate:false
                    //     },
                    //     mangle:{
                    //         toplevel:true,
                    //         eval:true
                    //     }
                    // });
                    var code={};
                    code[key]=I7_Core;
                    var options = { toplevel: true };
                    var _result = Terser.minify(code, options);
                    if(_result.error)console.log(_result.error);
                    I7_Core=_result.code;
                    I7_Core=I7_Core.replace('"use strict";','');
                    // console.log(I7_Core);
                }
                I7_Core=I7_Core.replace(/\/\/# sourceMappingURL.*/,'');
                fileConetent='function(require,module,exports){\n'+ I7_Core+'\n}';
                result+='define("'+key+'",'+fileConetent+');\n';
                add_code=false;
            }
            else if(extname=='.wxml' || extname=='.html'){
                var I7_Core=fs.readFileSync(item,'utf-8');
                if(I7_Core){
                    I7_Core = minifyHtml(I7_Core, {
                        removeAttributeQuotes: true,//尽可能删除属性周围的引号
                        includeAutoGeneratedTags:false,//插入HTML解析器生成的标签
                        keepClosingSlash:true,//在单例元素上保留尾部斜杠
                        removeComments:true,//剥离HTML评论
                        // 对属性/样式类进行排序
                        // Minifier选项喜欢sortAttributes并且sortClassName不会影响输出的纯文本大小。但是，它们形成了长重复的字符链，可以提高HTTP压缩中使用的gzip的压缩率。
                        sortAttributes:true,
                        sortClassName:false,
                        minifyCSS:extname=='.html',
                        minifyJS:extname=='.html',
                        collapseWhitespace:true,
                        collapseInlineTagWhitespace:true,//折叠时不要在元素之间留下任何空格。必须与。一起使用collapseWhitespace=true
                    });
                    fileConetent="'"+I7_Core.replace(/'/g,"\\\'")+"'";
                }
                else{
                    fileConetent="''";
                }
            }
            else if(extname=='.wxss' ||  extname=='.css'){
                var I7_Core=fs.readFileSync(item,'utf-8');
                if(I7_Core){
                    I7_Core=I7_Core.replace(/\/\*[\s\S]*?\*\//g, function(word) { // 去除注释后的文本  
                        return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;  
                    }); 
                    I7_Core=new CleanCSS({level:{
                        1:{
                            all:false
                        }
                    }}).minify(I7_Core).styles;
                    fileConetent="'"+I7_Core.replace(/'/g,"\\\'")+"'";
                }
                else{
                    fileConetent="''";
                }
            }
            else{
                var stat=fs.statSync(item);
                // console.log(stat.size);
                if(stat.size<10*1024){
                    var _mime = mime.getType(extname);
                    var I7_Core=fs.readFileSync(item);
                    fileConetent='"data:'+_mime+';base64,'+Buffer.from(I7_Core).toString('base64')+'"';
                }
                else{
                    add_code=false;
                    
                    mkdirsSync(path.join(__dirname,'release','App',path.dirname(key)));
                    fs.copyFileSync(item,path.join(__dirname,'release','App',key));
                    app_cache+='App/'+key+'\n';
                }
               
               
            }
            if(add_code){
                // result+='NBFileList["'+key+'"]='+fileConetent+';\n';
                result+='define("'+key+'",'+fileConetent+');\n';
            }
            // console.log(result);
        }
        catch(e){
            console.log(e);
        }
    });
  
    // console.log(result);
    
    fs.writeFileSync(path.join(__dirname,'release','App','app.'+(deviceType===''?'':deviceType+'.')+'js'), result);
    app_cache+='App/app.js\n';
    app_cache+='App/app.pad.js\n';
    app_cache+='App/app.pc.js\n';
}

//todo:处理分包
build_app('');
build_app('pad');
build_app('pc');

//生成 web 的打包代码
mkdirsSync(path.join(__dirname,'release','platform','web'));

var I7_Core=fs.readFileSync(path.join(__dirname,'platform','web','NB.config.js'),'utf-8');
var bbb=babel.transform(I7_Core,{presets: ['env'],compact: false});
I7_Core=bbb.code;
I7_Core=I7_Core.replace('"use strict";','');
var _result=UglifyJS.minify(I7_Core, {
    sourceMap:false,
    compress: {
        unused: true,
        toplevel:true,
        //   warnings:false,
        evaluate:false
    },
    mangle:{
        toplevel:true,
        eval:true
    }
});
if(_result.error)console.log(_result.error);
var nbConfig=_result.code;


var _content=fs.readFileSync(path.join(__dirname,'platform','web','NB.index.html'),'utf-8');
_content=_content.replace(/<script.*?NB.config.js.*?>/,'<script>'+nbConfig);
var projectConfig=JSON.parse(fs.readFileSync(path.join(__dirname,'source/project.config.json'),'utf8'));
_content=_content.replace(/{{appName}}/g,projectConfig.appName);
_content = minifyHtml(_content, {
    removeAttributeQuotes: true,//尽可能删除属性周围的引号
    includeAutoGeneratedTags:false,//插入HTML解析器生成的标签
    keepClosingSlash:true,//在单例元素上保留尾部斜杠
    removeComments:true,//剥离HTML评论
    // 对属性/样式类进行排序
    // Minifier选项喜欢sortAttributes并且sortClassName不会影响输出的纯文本大小。但是，它们形成了长重复的字符链，可以提高HTTP压缩中使用的gzip的压缩率。
    sortAttributes:true,
    sortClassName:false,
    minifyCSS:true,
    minifyJS:true,
    collapseWhitespace:true,
    collapseInlineTagWhitespace:true,//折叠时不要在元素之间留下任何空格。必须与。一起使用collapseWhitespace=true
});
// _content=_content.replace('<html>','<html manifest="./NB.index.appcache">');
_content=_content.replace('NBConfig={debug:!0','var NBConfig={debug:!1');

var platform_path=path.join(__dirname,'release','platform');

fs.writeFileSync(path.join(platform_path,'web','NB.index.html'), _content);

var sdk_path=path.join(platform_path,'web','NB.sdk.js');
if(fs.existsSync(sdk_path)){
    fs.unlinkSync(sdk_path);
}
fs.linkSync(__dirname+'/source/NB.sdk.js',sdk_path);

// if(!fs.existsSync(path.join(platform_path,'web','App'))){
//     fs.symlinkSync(path.join(__dirname,'release','App'),path.join(platform_path,'web','App'));
// }
if(fs.existsSync(path.join(platform_path,'web','App'))){
    fsUtils.rmdirsSync(path.join(platform_path,'web','App'));
}
fsUtils.copySync(path.join(__dirname,'release','App'),path.join(platform_path,'web','App'),function(){},{});

// if(!fs.existsSync(path.join(platform_path,'web','logo'))){
//     fs.symlinkSync(path.join(__dirname,'platform','web','logo'),path.join(platform_path,'web','logo'));
// }
if(fs.existsSync(path.join(platform_path,'web','logo'))){
    fsUtils.rmdirsSync(path.join(platform_path,'web','logo'));
}
fsUtils.copySync(path.join(__dirname,'platform','web','logo'),path.join(platform_path,'web','logo'),function(){},{});

readDirSync(path.join(platform_path,'web','logo'),function(item,fileName){
    if(item.indexOf('.DS_Store')>-1) return;
    app_cache+='logo/'+fileName+'\n';
});

app_cache+='\n\nNETWORK:\n*';

fs.writeFileSync(path.join(platform_path,'web','NB.index.appcache'), app_cache);